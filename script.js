$(document).ready(function () {
    $("#title").focus();
    $("#text").autosize();
  });
  document.getElementById("contact").addEventListener("mouseover", function() {
    this.textContent = "( NO LOL )";
});

document.getElementById("contact").addEventListener("mouseout", function() {
    this.textContent = "CONTACT";
});
