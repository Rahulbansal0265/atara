function blockUI(element = "") {
  if (element != "") {
    $(element).block({
      message: '<img src="/assets/images/Hourglass.gif" width=50 height=50>',
    });
  } else {
    $.fn.center = function () {
      this.css("position", "absolute");
      this.css(
        "top",
        ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px"
      );
      this.css(
        "left",
        ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px"
      );
      return this;
    };
    $.blockUI({
      css: {
        backgroundColor: "transparent",
        border: "none",
      },
      message: '<img src="/assets/images/Hourglass.gif" height=50 width=50>',
      baseZ: 1500,
      overlayCSS: {
        backgroundColor: "#FFFFFF",
        opacity: 0.9,
        cursor: "wait",
      },
    });
    $(".blockUI.blockMsg").center();
  }
}

function unblockUI(element = "") {
  if (element != "") {
    $(element).unblock();
  } else {
    $.unblockUI();
  }
}

function showActionsModal(title, html) {
  $("#actions_modal_title").html(title);
  $("#action_menus").html(html);
  $("#myModal").modal("show");
}

function hideActionsModalEvent(event) {
  var modal_div = document.querySelectorAll("#myModal");
  var result = Array.apply(0, modal_div).find((v) => v.contains(event.target));
  if (!result) {
    let classes = $(event.target).attr("class");
    if (!classes || !classes.includes("hamburger_icon_class")) {
      hideActionsModal();
    }
  }
}

function hideActionsModal() {
  $("#myModal").modal("hide");
}

// function openModal(modal_header, modal_body) {
//   var replacableString = modal_body.replace(/<>/g, "'");
//   $("#modal_header").html(modal_header);
//   $("#modal_body").html(replacableString);
//   $("#fire-modal-2").modal("show");
// }

function openModal(id, title, url) {
  hideActionsModal();
  $.ajax({
    url: `${url}`,
    method: "post",
    data: { id: id },
    success: (data) => {
      $("#modal_titile").html(`<strong>${title}</strong>`);
      $("#modal_body").html(data);
      $("#fire-modal-6").modal("show");
    },
  });
}

function datatableReload(element) {
  var table = $(element).DataTable();
  table.ajax.reload();
  // bindTooltip();
}

// function flashMessage() {
//   close = document.getElementById("close");
//   close.addEventListener(
//     "click",
//     function () {
//       note = document.getElementById("note");
//       note.style.display = "none";
//     },
//     false
//   );
// }

setTimeout(function () {
  $("#note").fadeOut("slow");
  // $('#box').hide();
}, 3000);

// $("#note").fadeIn(100);
function stopHandler(event, obj) {
  // var elem = obj.item[0];
  // var sampleSortableGroup = $(".js-sortable-group").first().clone().html("");

  var arr = [];
  $(".alert_box").each(function () {
    var idsArr = JSON.parse(this.id);
    var data = idsArr;
    arr.push(data);
    // $(this).attr("id", "m_" + idCount);
    // idCount++;
  });

  $.ajax({
    url: `/admin/draggableParent`,
    method: "post",
    data: { modulesArr: arr },
    success: (data) => {
      console.log(data);
      // $("#modal_titile").html(`<strong>${title}</strong>`);
      // $("#modal_body").html(data);
      // $("#fire-modal-6").modal("show");
    },
  });
}

// $(".js-sortable-parent").sortable().disableSelection();

// var sortableGroup = $(".js-sortable-group")
//   .sortable({
//     connectWith: ".js-drop-target",
//     stop: stopHandler,
//   })
//   .disableSelection();

function stopChildHandler(event, obj) {
  // var elem = obj.item[0];
  // var sampleSortableGroup = $(".js-sortable-group").first().clone().html("");

  var arr = [];
  $(".child_box").each(function () {
    var idsArr = JSON.parse(this.id);
    var data = idsArr;
    arr.push(data);
    // $(this).attr("id", "m_" + idCount);
    // idCount++;
  });

  $.ajax({
    url: `/admin/draggableChild`,
    method: "post",
    data: { modulesArr: arr },
    success: (data) => {
      console.log(data);
    },
  });
}

// var child = $(".child-sortable-group")
//   .sortable({
//     connectWith: ".child-drop-target",
//     stop: stopChildHandler,
//   })
//   .disableSelection();

var copyright = $("#hidden_copyright").val();
$("#footer_copyright").html(copyright);



var header = $("#hidden_header").val();

$(".navbar-bg").css("background-color", `${header}`);

$(document).ready(function () {
  document.addEventListener("click", hideActionsModalEvent);
});
