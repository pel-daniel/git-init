var commands = [
  {
    animation: gitInit,
    command: 'git init',
    $element: '#git-init',
    output: 'Initialized repo'
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

    command.animation()
  }
}

function gitInit() {
  $('.area').show().animate({ height: '100%' }, 700, function() {
    $('.area-title').fadeIn(400)
  })
}
