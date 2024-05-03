var locationViewLength = $("#locationViewLength").val();

var i = locationViewLength != "" ? parseInt(locationViewLength) : 0;

function addMore() {
  i += 1;
  var html = `<div id="hide_show_div_${i}"><legend class="text-bold">Location of followers</legend><div class="row"><div class="col-sm-6"><strong>Country</strong></div><div class="col-sm-6"><strong>Percentage</strong></div></div><div class="form-group ml-5 mt-5"><div class="col-lg-6"><input name="country_one"id="country_one_${i}" onkeyup="return trim(this)" class="form-control" placeholder="Please enter country with percentage of followers"></div><div class="col-lg-6"><input type="number" min="1" max="100"  name="country_one_percentage"id="countryPercentage_one_${i}" onkeyup="return trim(this)" class="form-control" placeholder="Please enter percentage of country"></div></div><div class="form-group ml-5"><div class="col-lg-6"><input name="country_two" onkeyup="return trim(this)" id="country_two_${i}" class="form-control" placeholder="Please enter country with percentage of followers"></div><div class="col-lg-6"><input type="number" min="1" max="100"  name="country_two_percentage" id="countryPercentage_two_${i}" onkeyup="return trim(this)" class="form-control" placeholder="Please enter percentage of country"></div></div><div class="form-group ml-5"><div class="col-lg-6"><input name="country_three" onkeyup="return trim(this)" id="country_three_${i}" class="form-control" placeholder="Please enter country with percentage of followers"></div><div class="col-lg-6"><input type="number" min="1" max="100"  name="country_three_percentage" id="countryPercentage_three_${i}" onkeyup="return trim(this)" class="form-control" placeholder="Please enter percentage of country"></div></div> <div class="row"><div class="col-sm-6"><strong>City</strong></div><div class="col-sm-6"><strong>Percentage</strong></div></div><div class="form-group ml-5 mt-5"><div class="col-lg-6"><input type="text" onkeyup="return trim(this)" id="city_one_${i}" name="city_one" class="form-control" placeholder="Please enter city with percentage of followers"></div><div class="col-lg-6"><input type="number" min="1" max="100" onkeyup="return trim(this)" id="cityPercentage_one_${i}" name="city_one_percentage" class="form-control" placeholder="Please enter percentage of city"></div></div><div class="form-group ml-5"><div class="col-lg-6"><input type="text" onkeyup="return trim(this)" id="city_two_${i}" name="city_two" class="form-control" placeholder="Please enter city with percentage of followers"></div><div class="col-lg-6"><input type="number" min="1" max="100"  onkeyup="return trim(this)" id="cityPercentage_two_${i}" name="city_two_percentage" class="form-control" placeholder="Please enter percentage of city"></div></div><div class="form-group ml-5"><div class="col-lg-6"><input type="text" onkeyup="return trim(this)" id="city_three_${i}" name="city_three" class="form-control" placeholder="Please enter city with percentage of followers"></div><div class="col-lg-6"><input type="number" min="1" max="100"  onkeyup="return trim(this)" id="cityPercentage_three_${i}" name="city_three_percentage" class="form-control" placeholder="Please enter percentage of city"></div></div><button type="button" class="btn btn-danger" onclick="remove('${i}')" id="addSubRenovation">Remove</button><legend class="text-bold"></legend></div>`;

  $("#location_view_div").append(html);
}

function remove(index) {
  i -= 1;
  $(`#hide_show_div_${index}`).remove();
}

$("#category_form").on("submit", function (event) {
  var arr = [];

  if ($("#influencer_id").val() == null) {
    $(".drpdwn_error_div").html("Please select influencer");
    arr.push(false);
  } else {
    $(".drpdwn_error_div").html("");
    arr.push(true);
  }

  if ($("#view_avg").val() == "") {
    $(".view_avg_error_div").html("Please enter average view");
    arr.push(false);
  } else {
    $(".view_avg_error_div").html("");
    arr.push(true);
  }

  if ($("#less_than_eighteen").val() == "") {
    $(".less_than_eighteen_error").html("Please enter age less than 18");
    arr.push(false);
  } else {
    $(".less_than_eighteen_error").html("");
    arr.push(true);
  }

  if ($("#eighteen_to_twentyFour").val() == "") {
    $(".eighteen_to_twentyFour_error").html(
      "Please enter age in between 18 to 24"
    );
    arr.push(false);
  } else {
    $(".eighteen_to_twentyFour_error").html("");
    arr.push(true);
  }

  if ($("#twentyFive_to_thirtyFour").val() == "") {
    $(".twentyFive_to_thirtyFour_error").html(
      "Please enter age in between 25 to 34"
    );
    arr.push(false);
  } else {
    $(".twentyFive_to_thirtyFour_error").html("");
    arr.push(true);
  }

  if ($("#thirtyFive_to_fourtyFour").val() == "") {
    $(".thirtyFive_to_fourtyFour_error").html(
      "Please enter age in between 35 to 44"
    );
    arr.push(false);
  } else {
    $(".thirtyFive_to_fourtyFour_error").html("");
    arr.push(true);
  }

  if ($("#moreThan_fourtyFour").val() == "") {
    $(".moreThan_fourtyFour_error").html("Please enter age more than 44");
    arr.push(false);
  } else {
    $(".moreThan_fourtyFour_error").html("");
    arr.push(true);
  }

  if ($("#male").val() == "") {
    $(".male_error").html("Please enter number of male in percentage");
    arr.push(false);
  } else {
    $(".male_error").html("");
    arr.push(true);
  }

  if ($("#female").val() == "") {
    $(".female_error").html("Please enter number of female in percenatge");
    arr.push(false);
  } else {
    $(".female_error").html("");
    arr.push(true);
  }

  $("#location_view_div")
    .find("input")
    .each(function (index) {
      if ($(`#${this.id}`).val() == "") {
        var id = this.id;
        console.log(id, ";l;l;l;l;l;l;l;l;l");
        var idsArr = id.split("_");
        if ($(`.error_div_${index}`).text() == "" && idsArr[0] == "country") {
          $(this).next().remove();
          $(`input[id=${this.id}]`).after(
            `<div class="error_div_${index} error" id="error_div_${index}"></div>`
          );
          $(`.error_div_${index}`).html("Please enter country");
        }

        if ($(`.error_div_${index}`).text() == "" && idsArr[0] == "city") {
          $(this).next().remove();
          $(`input[id=${this.id}]`).after(
            `<div class="error_div_${index} error" id="error_div_${index}"></div>`
          );
          $(`.error_div_${index}`).html("Please enter city");
        }

        if (
          $(`.error_div_${index}`).text() == "" &&
          idsArr[0] == "cityPercentage"
        ) {
          $(this).next().remove();
          $(`input[id=${this.id}]`).after(
            `<div class="error_div_${index} error" id="error_div_${index}"></div>`
          );
          $(`.error_div_${index}`).html("Please enter percentage of city");
        }

        if (
          $(`.error_div_${index}`).text() == "" &&
          idsArr[0] == "countryPercentage"
        ) {
          $(this).next().remove();
          $(`input[id=${this.id}]`).after(
            `<div class="error_div_${index} error" id="error_div_${index}"></div>`
          );
          $(`.error_div_${index}`).html("Please enter percentage of country");
        }

        arr.push(false);
      } else {
        $(`.error_div_${index}`).html("");
        arr.push(true);
      }
    });
  if (arr.includes(false)) {
    event.preventDefault();
  }
});

function trim(el) {
  var id = $(el).next().attr("id");
  var error = $(`#${id}`).text();
  if (el.value.indexOf(" ") == 0) {
    el.value = el.value.replace(/(^\s*)|(\s*$)/gi, "");
  }

  //   console.log(el.value,"kkkkkkkkkkkkk")
  //  console.log($(`#${el.id}`).val(),"lllllllllllll")
  var elem_id_val=el.value
  console.log(el.id)
  var elem_id=el.id
  var idsArr=elem_id.split("_")
  if(idsArr[0]=="cityPercentage" || idsArr[0]=="countryPercentage"){
    if (elem_id_val.length > 3) {
      el.value = "";
    }
  }
  

  if (el.value != "") {
    $(`#${id}`).html("");
  }
  return;
}
