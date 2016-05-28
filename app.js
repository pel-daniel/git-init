var fileName = 'tasks.txt'

var commands = [
  {
    animation: gitInit,
    command: 'git init',
    $element: '#git-init',
    output: 'Initialized repo'
  },
  {
    animation: touchFile,
    command: 'touch ' + fileName,
    $element: '#touch',
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

    command.animation(command)
  }
}

function gitInit() {
  $('.area').show().animate({ height: '100%' }, 700, function() {
    $('.area-title').fadeIn(400)
  })
}

function touchFile(command) {
  var $file = createFileHtml(command.payload.fileName)
  $file.appendTo('#workingDir')
  $file.fadeIn()
}

function createFileHtml(fileName) {
  return $('<div/>', { class: 'file hidden', text: fileName })
}
