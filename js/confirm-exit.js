// js/confirm-exit.js
// Adds a confirmation dialog when clicking the logo link to the main site

document.addEventListener('DOMContentLoaded', function () {
  var logoLink = document.querySelector('.logo a');
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      var confirmed = confirm('Do you really want to leave the blog and go to the main Aroice site?');
      if (!confirmed) {
        e.preventDefault();
      }
    });
  }
});
