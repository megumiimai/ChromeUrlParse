$(function() {
    var paramList = (function() {
        var key = localStorage.getItem("key");
        function createLi(obj) {
            var paramsObj = JSON.parse(obj);
            var dom = "";
            for (var key in paramsObj) {
                var value = paramsObj[key];
                dom += li(key, value);
            }
            $(".list").html("").append(dom);
        }
        function li(key, value) {
            return `<li>
                        <div class="field is-horizontal">
                            <div class="field-label ">
                                <label class="label param-name">${key}</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <input id="${key}" class="input is-small param-value" type="text" value="${value}">
                                        <a class="is-outlined is-small j-decode" data-isDecode="0"><img class="icon" src="../icons/decode.png" alt="decode"></a>
                                        <a class="is-outlined is-small j-delete"><img class="icon" src="../icons/delete.png" alt="delete"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>`;
        }

        function searchFilter(val) {
            var $li = $(".list li");
            if (!val.length) {
                $li.show();
                return;
            }
            for (var i = 0; i < $li.length; i++) {
                var elem = $li.eq(i);
                var isExist = elem.find(".label").text().indexOf(val) > -1 ? true : false;
                if (!isExist) {
                    elem.hide();
                } else {
                    elem.show();
                }
            }
        }

        function sendMessage(obj) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, obj, function(response) {});
            });
        }

        function evnetBind() {
            $(document).on("click", ".j-decode", function(e) {
                var elem = $(this).parent(".control").find("input");
                if ($(this).attr("data-isDecode") == "0") {
                    elem.val(decodeURIComponent(elem.val()));
                    $(this).attr("data-isDecode", 1).children('img').attr("src", "../icons/encode.png");
                } else {
                    elem.val(encodeURIComponent(elem.val()));
                    $(this).attr("data-isDecode", 0).children('img').attr("src", "../icons/decode.png");
                }
            });
            $(document).on("input", ".search-input", function(e) {
                var val = $(this).val();
                searchFilter(val);
            });

            $(document).on("click", ".j-delete", function(e) {
                $(this).parents("li").remove();
            });

            $(document).on("click", ".refresh", function(e) {
                var list = $(".list li");
                var length = list.length;
                var params = "";
                var i = 0;
                for (; i < length; i++) {
                    var li = list.eq(i);
                    params += li.find(".param-name").text() + "=" + li.find(".param-value").val() + "&";
                }
                sendMessage({
                    result: 0,
                    type: 1,
                    msg: params
                });
            });
        }
        return {
            init: function() {
                createLi(key);
                evnetBind();
            }
        };
    })();

    paramList.init();
});
