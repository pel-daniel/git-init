$(function() {
  $('#git-init').click(gitInit)
})

function gitInit(e) {
  e.preventDefault()
  e.stopPropagation()

  $('.area').show().animate({ height: '100%' }, 700, function() {
    $('.area-title').fadeIn(400)
  })
}
