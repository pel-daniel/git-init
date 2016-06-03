var fileName = 'tasks.txt'
var message1 = 'Add file ' + fileName
var commitHash1 = 'cc04c1f'

var commands = [
  {
    animation: gitInit,
    command: 'git init',
    $element: '#git-init',
    output: 'Initialized empty git repository in my_dir/.git/'
  },
  {
    animation: modifyFile,
    command: 'touch ' + fileName,
    $element: '#touch',
    payload: {
      fileName: fileName
    },
    output: null
  },
  {
    animation: gitAdd,
    command: 'git add ' + fileName,
    $element: '#git-add',
    output: null
  },
  {
    animation: gitCommit,
    command: 'git commit -m "' + message1 + '"',
    $element: '#git-commit',
    payload: {
      hash: commitHash1,
      message: message1
    },
    output: '<div>[master (root-commit) ' + commitHash1 + '] Add file ' + fileName +
      '</div><div> 1 file changed, 0 insertions(+), 0 deletions(-)</div>' +
      '<div> create mode 100644 ' + fileName + '</div>'
  },
  {
    animation: modifyFile,
    command: 'echo "Buy milk!" >> ' + fileName,
    $element: '#echo',
    payload: {
      fileName: fileName
    },
    output: null
  }
]

$(function() {
  commands.forEach(function(c) {
    $(c.$element).click(animateCommand(c))
  })
})

function animateCommand(command) {
  return function(e) {
    e.preventDefault()
    e.stopPropagation()

    // 1. show command in console div
    // 2. show animation
    // 3. show command output in console div
    showCommand(command)
    .then(function() {
      return command.animation(command.payload)
    }).then(function() {
      return showCommandOutput(command)
    }).catch(function() {
      return new Promise(function(resolve, reject) {
        appendNewPrompt(resolve)
      })
    })
  }
}

function showCommand(command) {
  var $consoleCommand = createCommandHtml(command)
  var $commandGroup = $('.console-command-group:last-child .console-command')

  return new Promise(function(resolve, reject) {
    $consoleCommand.
      appendTo($commandGroup).
      fadeIn(400, function() {
        resolve()
      })
  })
}

function showCommandOutput(command) {
  var $commandGroup = $('.console-command-group:last-child .console-command')

  return new Promise(function(resolve, reject) {
    if(command.output) {
      var $commandOutput = createCommandOutputHtml(command)

      $commandOutput.
        appendTo($commandGroup).
        fadeIn(400, function() {
          appendNewPrompt(resolve)
        })
    } else {
      appendNewPrompt(resolve)
    }
  })
}

function appendNewPrompt(resolve) {
  var $newCommandGroup = createCommandGroupHtml()

  $newCommandGroup.
    appendTo('.console').
    fadeIn(400, function() {
      var $console = $('.console')

      $console.animate(
        { scrollTop: $console.prop('scrollHeight') - $console.outerHeight() },
        400,
        function() {
          resolve()
        }
      )
    })
}

function gitAdd() {
  var $file = $('#workingDir > .file')
  var width = $('.area').outerWidth(true)

  if($file.length == 0) {
    return Promise.reject()
  }

  return new Promise(function(resolve, reject) {
    $file.animate({ left: width + 'px' }, 700, function() {
      $(this).remove().css('left', 0).appendTo('#staging')
      resolve()
    })
  })
}

function gitCommit(payload) {
  var $staging = $('#staging')

  if($staging.children().length == 0) {
    return Promise.reject()
  }

  var $commit = createCommitHtml(
    payload,
    $staging.height(),
    $staging.width()
  )

  $staging.empty().append($commit)

  return new Promise(function(resolve, reject) {
    $commit.find('.commit-node').animate(
      {
        'border-radius': '50%',
        height: '22px',
        width: '22px'
      },
      500,
      function() {
        var width = $('.area').outerWidth(true)
        var $commitArea = $('#commit-area')

        var $spacer = createSpacerHtml()

        $spacer.delay(400).prependTo($commitArea).slideDown(700)

        $commit.delay(400).animate({ left: width + 'px' }, 700, function() {
          $spacer.remove()
          $(this).css('left', 0).prependTo($commitArea)
          $(this).find('.commit-message').delay(400).fadeIn(400, function() {
            resolve()
          })
        })
      }
    )
  })
}

function gitInit() {
  return new Promise(function(resolve, reject) {
  $('.area').show().animate({ height: '100%' }, 700, function() {
      $('.area-title').fadeIn(400, function() {
        resolve()
      })
    })
  })
}

function modifyFile(payload) {
  var $file = createFileHtml(payload.fileName)
  $file.appendTo('#workingDir')
  return new Promise(function(resolve, reject) {
    $file.fadeIn(400, function() {
      resolve()
    })
  })
}

function createFileHtml(fileName) {
  return $('<div/>', { class: 'file', text: fileName }).hide()
}

function createCommitHtml(payload, height, width) {
  var $commitNode = $('<span/>', {
    class: 'commit-node',
    height: height,
    width: width
  })
  var $message =
    $('<p/>', {
      class: 'commit-message',
      text: payload.hash + ' ' + payload.message
    }).hide()

  return $('<div/>', { class: 'commit' }).append($commitNode).append($message)
}

function createSpacerHtml() {
  return $('<div/>', { height: 32 }).hide()
}

function createCommandHtml(command) {
  return $('<span/>', { text: command.command }).hide()
}

function createCommandGroupHtml() {
  var $consolePrompt = $('<span/>', { class: 'console-prompt', text: '>' })
  var $consoleCommand = $('<div/>', { class: 'console-command' }).append($consolePrompt)

  return $('<div/>', { class: 'console-command-group' }).hide().append($consoleCommand)
}

function createCommandOutputHtml(command) {
  return $('<div/>', { class: 'console-output' }).html(command.output).hide()
}
