$(document).ready(function () {
  $(".button-collapse").sideNav();

  $("select").material_select();

  countDown();
  uncheckRadio();
});


function countDown() {
  if (document.getElementById('timer')) {
    var interval = setInterval(function() {
      var timer = $('#timer');
      var timerText = timer.html();
      let timeArray = timerText.split(':');
      var minutes = parseInt(timeArray[0], 10);
      var seconds = parseInt(timeArray[1], 10);
      seconds -= 1;
      if (minutes < 0) {
        return clearInterval(interval);
      }
      if (minutes < 10 && minutes.length != 2) minutes = '0' + minutes;
      if (seconds < 0 && minutes != 0) {
          minutes -= 1;
          seconds = 59;
      } else if (seconds < 10 && length.seconds != 2) {
        seconds = '0' + seconds;
      }
      timer.html(minutes + ':' + seconds);

      if (minutes == 0 && seconds < 30) {
        timer.css("color", "red");
      }

      if (minutes == 0 && seconds == 0){
        clearInterval(interval);
        submitQuiz();
      }
    }, 1000)
  }
}

function submitQuiz () {
  $(".quizForm").submit();
}

function uncheckRadio () {
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(function(radio, i) {
    radio.onclick = function (e) {
      if (e.ctrlKey) {
        this.checked = false;
      }
    }
  });
}