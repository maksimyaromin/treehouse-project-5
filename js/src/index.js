{
    const capitalize = ([a, ...b]) => {
        return a.toUpperCase() + b.join("");
    };

    /* Хэлпер для получения активного плэйсхолдера
    */
    const activePlaceholder = (element) => {
        const action = () => {
            if(element.val()) {
                element.addClass("fill");
            } else {
                element.removeClass("fill");
            }
        };
        element.on("blur", action).addClass("active");
    };

    $.fn.employees = function(options) {

        const state = Object.assign({
            data: [],
            buffer: [],
            element: this
        }, options);

        const clean = () => {
            state.element.find(".employees-list").remove();
            state.element.find(".error").remove();
        };

        const hideDetailPopup = (element) => {
            element.addClass("close-popup").one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", () => {
                $(document.body).off("click.popup");
                element.remove();
            });
        };

        const showDetailPopup = (employee, index) => {
            $(".popup-wrapper").remove();
            const employeeAddress = `
                ${employee.location.street.toUpperCase()}${employee.location.state ? ", " + employee.location.state.toUpperCase() : ""}, ${employee.location.postcode}
            `;
            const popupContext = $(`
                <div class="popup-wrapper">
                    <div class="popup-overlay"></div>
                    <div class="popup-content employee-window">
                        <span class="action-close"></span>
                        ${index === 0
                            ? ""
                            : "<span class=\"action-prev\"></span>"
                        }
                        ${index >= state.buffer.length - 1
                            ? ""
                            : "<span class=\"action-next\"></span>"
                        }
                        <div class="employee__avatar">
                            <img src="${employee.picture.large}" alt="${employee.name.first} ${employee.name.last}" />
                        </div>
                        <div class="employee__name">
                            <span>${capitalize(employee.name.first)} ${capitalize(employee.name.last)}<span>
                        </div>
                        <div class="employee__email">
                            <a href="mailto:${employee.email}">${employee.email}</a>
                        </div>
                        <div class="employee__city">
                            <span>${capitalize(employee.location.city)}</span>
                        </div>
                        <div class="devider"></div>
                        <div class="employee__phone">
                            <span>${employee.phone}</span>
                        </div>
                        <div class="employee__address">
                            <span>${employeeAddress}</span>
                        </div>
                        <div class="employee__dob">
                            <span>Birthday: ${new Date(employee.dob).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            `).appendTo($(document.body)).one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", () => {
                $(document.body).on("click.popup", () => {
                    hideDetailPopup(popupContext);
                });
                popupContext.find(".popup-content").on("click.popup", e => e.stopPropagation());
            });

            
            
            const closeAction = popupContext.find(".action-close");
            closeAction.on("click", () => {
                hideDetailPopup(popupContext);
            });

            const nextAction = popupContext.find(".action-next");
            nextAction.on("click", () => {
                popupContext.remove();
                showDetailPopup(state.buffer[index + 1], index + 1);
            });

            const prevAction = popupContext.find(".action-prev");
            prevAction.on("click", () => {
                popupContext.remove();
                showDetailPopup(state.buffer[index - 1], index - 1);
            });
        };

        const detailInit = (e) => {
            const employeeContext = $(e.target).closest(".employee");
            let employee, index;
            for (let i = 0; i < state.buffer.length; i++) {
                const item = state.buffer[i];
                if(`${item.id.name||i}${item.id.value||""}` === employeeContext.data("uid")) {
                    employee = item;
                    index = i;
                    break;
                }
            }
            if(!employee) { return; }
            showDetailPopup(employee, index);
        };

        const buildList = (employees) => {
            clean();
            const context = $(`<div class="employees-list"></div>`)
                .appendTo(state.element);
            employees.forEach((employee, index) => {
                context.append(`
                    <div class="employee" data-uid="${employee.id.name||index}${employee.id.value||""}">
                        <div class="employee__avatar">
                            <img src="${employee.picture.large}" alt="${employee.name.first} ${employee.name.last}" />
                        </div>
                        <div class="employee-wrapper">
                            <div class="employee__name">
                                <span class="employee__name-title">${employee.name.title}</span>
                                <span>${capitalize(employee.name.first)} ${capitalize(employee.name.last)}<span>
                                <span class="employee__name-username">${employee.login.username}</span>
                            </div>
                            <div class="employee__email">
                                <a href="mailto:${employee.email}">${employee.email}</a>
                            </div>
                            <div class="employee__city">
                                <span>${capitalize(employee.location.city)}</span>
                            </div>
                        </div>
                    </div>
                `);
            });

            if(state.detail) {
                context.find(".employee").off("click").on("click", detailInit);
            }
        };

        const buildFilter = () => {

            const context = $(`
                <div class="employees__search-box">
                    <form action="#" class="search-box__form">
                        <div class="search-box__input">
                            <input type="search" name="search" id="search" />
                            <span class="active-placeholder">Search</span>
                        </div>
                    </form>
                </div>
            `).prependTo(state.element);
            const searchBox = context.find("#search");
            activePlaceholder(searchBox);

            // Just in case it is better to disable form submission on Enter button pressing
            context.find("form").on("keyup keypress", e => {
                const keyCode = e.keyCode || e.which;
                if (keyCode === 13) { 
                    e.preventDefault();
                    return false;
                }
            });

            searchBox.on("input", e => {
                const value = $(e.target).val();
                if(value) {
                    const result = state.data.filter(employee => {
                        const pattern = new RegExp(value, "i");
                        return pattern.test(employee.login.username)
                            || pattern.test(employee.name.first)
                            || pattern.test(employee.name.last);
                    });
                    if(result && result.length) {
                        state.buffer = result;
                        buildList(result);
                    } else {
                        clean();
                        state.buffer = [];
                        state.element.append(`
                            <div class="error error-messenge">
                                <span>К сожалению ваш запрос не дал результатов</span>
                            </div>
                        `);
                    }
                } else {
                    state.buffer = [ ...state.data ];
                    buildList(state.buffer);
                }
            });
        };

        const build = () => {
            buildList(state.buffer);
            if(state.filterable) {
                buildFilter();
            }
        };

        if(typeof state.dataSource.transport === "function") {
            const success = (data) => {
                state.data = data.results;
                state.buffer = [ ...state.data ];
                build();
            };
            const error = (err) => {
                state.element.html(`
                    <div class="error error-messenge">
                        <span>${err.error ? err.error : "Извинте, в данный момент сервис недоступен. Повторите попытку позже."}</span>
                    </div>
                `);
            };
            state.dataSource.transport(success, error);
        } else {
            state.data = state.dataSource.data || [];
            state.buffer = [ ...state.data ];
            build();
        }

        this.data("employees", state);

    };

    $(document).ready(() => {
        $(".employees-wrapper").employees({
            dataSource: {
                transport: (success, error) => {
                    const spinner = $(`<div class="mask"><div class="spinner"></div></div>`).prependTo($(document.body));
                    $.ajax({
                        url: "https://randomuser.me/api/",
                        data: { results: 12, nat: "us,au,gb" },
                        dataType: "json"
                    }).always(() => {
                        spinner.remove();
                    })
                    .done(success).fail(error);    
                }
            },
            filterable: true,
            detail: true
        });
    });
}