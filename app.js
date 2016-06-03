var fileName = 'tasks.txt'
var message1 = 'Add file ' + fileName

var commands = [
  {
    animation: gitInit,
    command: 'git init',
    $element: '#git-init',
    output: 'Initialized repo'
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
      message: message1
    },
    output: null
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

    var $commandGroup = $('.console-command-group:last-child')
    var $consoleCommand = createCommandHtml(command)

    $consoleCommand.
      appendTo($commandGroup.find('.console-command')).
      fadeIn(400, function() {
        command.animation(command.payload).then(function() {
          var $newCommandGroup = createCommandGroupHtml()

          $newCommandGroup.appendTo('.console').fadeIn(400)
        })
      })
  }
}

function gitAdd() {
  var $file = $('#workingDir > .file')
  var width = $('.area').outerWidth(true)

  return new Promise(function(resolve, reject) {
    $file.animate({ left: width + 'px' }, 700, function() {
      $(this).remove().css('left', 0).appendTo('#staging')
      resolve()
    })
  })
}

function gitCommit(payload) {
  var $staging = $('#staging')
  var $commit = createCommitHtml(
    payload.message,
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

function createCommitHtml(message, height, width) {
  var $commitNode = $('<span/>', {
    class: 'commit-node',
    height: height,
    width: width
  })
  var $message = $('<p/>', { class: 'commit-message', text: message }).hide()

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
