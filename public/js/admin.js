$(document).ready(function () {
  $(".delete-link").on("click", function (e) {
    $target = $(e.target);
    const id = $target.attr("data-id");
    const itemType = $target.attr("data-type");
    deleteItem(id, itemType);
  });

  var createTokenForm = $("#create-token-form");
  var createTokenBtn = $("#create-token-btn");
  createTokenForm.on("submit", bulkCreateTokens)

});

function deleteItem (id, itemType) {
  if (confirm(
      "Are you sure you want to delete this " + itemType +
      " from list of " + itemType + "s?")
      ) {
      $.ajax({
        type: "DELETE",
        url: `/admin/${itemType}/${id.toString()}`,
        success: function (response) {
          alert(response);
          location.reload();
        },
        error: function (err) {
          alert(`An error occured. Unable to delete ${itemType}`);
        }
      })
    }
}

function bulkCreateTokens (e) {
  e.preventDefault();
  $(
    `<div>
      <p id='token-nofication'>
        Tokens are being created.
        This might take a moment.
        Link to response will appear here.
      </p>
    </div>`
  ).appendTo("#create-token-form");
  var createTokenForm = $("#create-token-form");
  var createTokenBtn = $("#create-token-btn");
  createTokenBtn.attr("disabled", "true");
  let total = createTokenForm.find("input[name='total']").val();
  let maxUse = createTokenForm.find("input[name='maxUse']").val();
  if (total > 1 && maxUse > 0) {
    $.ajax({
      type: "POST",
      url: "/admin/token",
      data: { total, maxUse },
      success: function (response) {
        $('#token-nofication').html(`
          <strong>
          <a style='color: red' href='/admin/token/${response}'>
            Click here to see Token batch
          </a>
          </strong>
          `)

      },
      error: function (err) {
        createTokenBtn.attr("disabled", "false");
        alert(`An error occured while getting tokens. Try again later`);
      }
    })
  }
}
