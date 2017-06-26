$(document).ready(function () {
  $(".button-collapse").sideNav();
  $("select").material_select();
  $(".delete-link").on("click", function (e) {
    $target = $(e.target);
    const id = $target.attr("data-id");
    if (confirm("Are you sure you want to delete this institution from " +
                "list of institutions?")) {
                  $.ajax({
                    type: "DELETE",
                    url: "/admin/institution/" + id.toString(),
                    success: function (response) {
                      alert(response);
                      location.reload();
                    },
                    error: function (err) {
                      alert('An error occured. Unable to delete institution');
                    }
                  })
                }
    });
});
