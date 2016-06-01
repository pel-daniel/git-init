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

    command.animation(command.payload)
  }
}

function gitAdd() {
  var $file = $('#workingDir > .file')
  var width = $('.area').outerWidth(true)

  $file.animate({ left: width + 'px' }, 700, function() {
    $file.remove().css('left', 0).appendTo('#staging')
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
        $commit.css('left', 0).prependTo($commitArea)
        $commit.find('.commit-message').delay(400).fadeIn(400)
      })
    }
  )
}

function gitInit() {
  $('.area').show().animate({ height: '100%' }, 700, function() {
    $('.area-title').fadeIn(400)
  })
}

function modifyFile(payload) {
  var $file = createFileHtml(payload.fileName)
  $file.appendTo('#workingDir')
  $file.fadeIn()
}

function createFileHtml(fileName) {
  return $('<div/>', { class: 'file hidden', text: fileName })
}

function createCommitHtml(message, height, width) {
  var $commitNode = $('<span/>', {
    class: 'commit-node',
    height: height,
    width: width
  })
  var $message = $('<p/>', { class: 'commit-message hidden', text: message })

  return $('<div/>', { class: 'commit' }).append($commitNode).append($message)
}

function createSpacerHtml() {
  return $('<div/>', { class: 'hidden', height: 32 })
}
