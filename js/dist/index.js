function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

{
  var capitalize = function capitalize(_ref) {
    var _ref2 = _toArray(_ref),
        a = _ref2[0],
        b = _ref2.slice(1);

    return a.toUpperCase() + b.join("");
  };
  /* Хэлпер для получения активного плэйсхолдера
  */


  var activePlaceholder = function activePlaceholder(element) {
    var action = function action() {
      if (element.val()) {
        element.addClass("fill");
      } else {
        element.removeClass("fill");
      }
    };

    element.on("blur", action).addClass("active");
  };

  $.fn.employees = function (options) {
    var state = Object.assign({
      data: [],
      buffer: [],
      element: this
    }, options);

    var clean = function clean() {
      state.element.find(".employees-list").remove();
      state.element.find(".error").remove();
    };

    var hideDetailPopup = function hideDetailPopup(element) {
      element.addClass("close-popup").one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", function () {
        $(document.body).off("click.popup");
        element.remove();
      });
    };

    var showDetailPopup = function showDetailPopup(employee, index) {
      $(".popup-wrapper").remove();
      var employeeAddress = "\n                ".concat(employee.location.street.toUpperCase()).concat(employee.location.state ? ", " + employee.location.state.toUpperCase() : "", ", ").concat(employee.location.postcode, "\n            ");
      var popupContext = $("\n                <div class=\"popup-wrapper\">\n                    <div class=\"popup-overlay\"></div>\n                    <div class=\"popup-content employee-window\">\n                        <span class=\"action-close\"></span>\n                        ".concat(index === 0 ? "" : "<span class=\"action-prev\"></span>", "\n                        ").concat(index >= state.buffer.length - 1 ? "" : "<span class=\"action-next\"></span>", "\n                        <div class=\"employee__avatar\">\n                            <img src=\"").concat(employee.picture.large, "\" alt=\"").concat(employee.name.first, " ").concat(employee.name.last, "\" />\n                        </div>\n                        <div class=\"employee__name\">\n                            <span>").concat(capitalize(employee.name.first), " ").concat(capitalize(employee.name.last), "<span>\n                        </div>\n                        <div class=\"employee__email\">\n                            <a href=\"mailto:").concat(employee.email, "\">").concat(employee.email, "</a>\n                        </div>\n                        <div class=\"employee__city\">\n                            <span>").concat(capitalize(employee.location.city), "</span>\n                        </div>\n                        <div class=\"devider\"></div>\n                        <div class=\"employee__phone\">\n                            <span>").concat(employee.phone, "</span>\n                        </div>\n                        <div class=\"employee__address\">\n                            <span>").concat(employeeAddress, "</span>\n                        </div>\n                        <div class=\"employee__dob\">\n                            <span>Birthday: ").concat(new Date(employee.dob).toLocaleDateString(), "\n                        </div>\n                    </div>\n                </div>\n            ")).appendTo($(document.body)).one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", function () {
        $(document.body).on("click.popup", function () {
          hideDetailPopup(popupContext);
        });
        popupContext.find(".popup-content").on("click.popup", function (e) {
          return e.stopPropagation();
        });
      });
      var closeAction = popupContext.find(".action-close");
      closeAction.on("click", function () {
        hideDetailPopup(popupContext);
      });
      var nextAction = popupContext.find(".action-next");
      nextAction.on("click", function () {
        popupContext.remove();
        showDetailPopup(state.buffer[index + 1], index + 1);
      });
      var prevAction = popupContext.find(".action-prev");
      prevAction.on("click", function () {
        popupContext.remove();
        showDetailPopup(state.buffer[index - 1], index - 1);
      });
    };

    var detailInit = function detailInit(e) {
      var employeeContext = $(e.target).closest(".employee");
      var employee, index;

      for (var i = 0; i < state.buffer.length; i++) {
        var item = state.buffer[i];

        if ("".concat(item.id.name || i).concat(item.id.value || "") === employeeContext.data("uid")) {
          employee = item;
          index = i;
          break;
        }
      }

      if (!employee) {
        return;
      }

      showDetailPopup(employee, index);
    };

    var buildList = function buildList(employees) {
      clean();
      var context = $("<div class=\"employees-list\"></div>").appendTo(state.element);
      employees.forEach(function (employee, index) {
        context.append("\n                    <div class=\"employee\" data-uid=\"".concat(employee.id.name || index).concat(employee.id.value || "", "\">\n                        <div class=\"employee__avatar\">\n                            <img src=\"").concat(employee.picture.large, "\" alt=\"").concat(employee.name.first, " ").concat(employee.name.last, "\" />\n                        </div>\n                        <div class=\"employee-wrapper\">\n                            <div class=\"employee__name\">\n                                <span class=\"employee__name-title\">").concat(employee.name.title, "</span>\n                                <span>").concat(capitalize(employee.name.first), " ").concat(capitalize(employee.name.last), "<span>\n                                <span class=\"employee__name-username\">").concat(employee.login.username, "</span>\n                            </div>\n                            <div class=\"employee__email\">\n                                <a href=\"mailto:").concat(employee.email, "\">").concat(employee.email, "</a>\n                            </div>\n                            <div class=\"employee__city\">\n                                <span>").concat(capitalize(employee.location.city), "</span>\n                            </div>\n                        </div>\n                    </div>\n                "));
      });

      if (state.detail) {
        context.find(".employee").off("click").on("click", detailInit);
      }
    };

    var buildFilter = function buildFilter() {
      var context = $("\n                <div class=\"employees__search-box\">\n                    <form action=\"#\" class=\"search-box__form\">\n                        <div class=\"search-box__input\">\n                            <input type=\"search\" name=\"search\" id=\"search\" />\n                            <span class=\"active-placeholder\">Search</span>\n                        </div>\n                    </form>\n                </div>\n            ").prependTo(state.element);
      var searchBox = context.find("#search");
      activePlaceholder(searchBox); // Just in case it is better to disable form submission on Enter button pressing

      context.find("form").on("keyup keypress", function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode === 13) {
          e.preventDefault();
          return false;
        }
      });
      searchBox.on("input", function (e) {
        var value = $(e.target).val();

        if (value) {
          var result = state.data.filter(function (employee) {
            var pattern = new RegExp(value, "i");
            return pattern.test(employee.login.username) || pattern.test(employee.name.first) || pattern.test(employee.name.last);
          });

          if (result && result.length) {
            state.buffer = result;
            buildList(result);
          } else {
            clean();
            state.buffer = [];
            state.element.append("\n                            <div class=\"error error-messenge\">\n                                <span>\u041A \u0441\u043E\u0436\u0430\u043B\u0435\u043D\u0438\u044E \u0432\u0430\u0448 \u0437\u0430\u043F\u0440\u043E\u0441 \u043D\u0435 \u0434\u0430\u043B \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432</span>\n                            </div>\n                        ");
          }
        } else {
          state.buffer = _toConsumableArray(state.data);
          buildList(state.buffer);
        }
      });
    };

    var build = function build() {
      buildList(state.buffer);

      if (state.filterable) {
        buildFilter();
      }
    };

    if (typeof state.dataSource.transport === "function") {
      var success = function success(data) {
        state.data = data.results;
        state.buffer = _toConsumableArray(state.data);
        build();
      };

      var error = function error(err) {
        state.element.html("\n                    <div class=\"error error-messenge\">\n                        <span>".concat(err.error ? err.error : "Извинте, в данный момент сервис недоступен. Повторите попытку позже.", "</span>\n                    </div>\n                "));
      };

      state.dataSource.transport(success, error);
    } else {
      state.data = state.dataSource.data || [];
      state.buffer = _toConsumableArray(state.data);
      build();
    }

    this.data("employees", state);
  };

  $(document).ready(function () {
    $(".employees-wrapper").employees({
      dataSource: {
        transport: function transport(success, error) {
          var spinner = $("<div class=\"mask\"><div class=\"spinner\"></div></div>").prependTo($(document.body));
          $.ajax({
            url: "https://randomuser.me/api/",
            data: {
              results: 12,
              nat: "us,au,gb"
            },
            dataType: "json"
          }).always(function () {
            spinner.remove();
          }).done(success).fail(error);
        }
      },
      filterable: true,
      detail: true
    });
  });
}