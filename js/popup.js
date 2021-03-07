$(function() {
  const paramList = (function() {
    const key = localStorage.getItem("key");
    function createLi(obj) {
      const paramsObj = JSON.parse(obj);
      const paramsObjLength = Object.keys(paramsObj).length;
      let dom = "";
      let i = 1;
      let isShowAddIcon = false;
      for (const key in paramsObj) {
        var value = paramsObj[key];
        if (i == paramsObjLength) {
          isShowAddIcon = true;
        }
        dom += li(key, value, addIconElem(isShowAddIcon));
        i++;
      }
      $(".list").html("").append(dom);
    }
    function addIconElem(isShowAddIcon) {
      if (isShowAddIcon) {
        return　`
          <a class="is-outlined is-small j-add">
            <img class="add-icon" src="../icons/add.png" alt="add">
          </a>`;
      } else {
        return "";
      }
    }
    function li(key, value, addIconElem) {
      let keyElem = "";
      if (key) {
        keyElem = `<label class="label param-name">${key}</label>`
      } else {
        keyElem = `<input class="input is-small param-name" type="text" value="">`;
      }
      return `
        <li>
          <div class="field is-horizontal">
            <div class="field-label ">
              ${keyElem}
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input id="${key}" class="input is-small param-value" type="text" value="${value}">
                  <a class="is-outlined is-small j-decode" data-isDecode="0">
                    <img class="decode-icon" src="../icons/decode.png" alt="decode">
                  </a>
                  <a class="is-outlined is-small j-delete">
                    <img class="delete-icon" src="../icons/delete.png" alt="delete">
                  </a>
                  ${addIconElem}
                </div>
              </div>
            </div>
          </div>
        </li>`;
    }

    function searchFilter(val) {
      const $li = $(".list li");
      if (!val.length) {
        $li.show();
        return;
      }
      for (let i = 0; i < $li.length; i++) {
        const $elem = $li.eq(i);
        var isExist = $elem.find(".label").text().indexOf(val) > -1 ? true : false;
        if (!isExist) {
          $elem.hide();
        } else {
          $elem.show();
        }
      }
    }

    function sendMessage(obj) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, obj, function(response) {});
      });
    }

    function evnetBind() {
      $(document).on("click", ".j-decode", function() {
        let $elem = $(this).parent(".control").find("input");
        if ($(this).attr("data-isDecode") == "0") {
          $elem.val(decodeURIComponent($elem.val()));
          $(this).attr("data-isDecode", 1).children('img').attr("src", "../icons/encode.png");
        } else {
          $elem.val(encodeURIComponent($elem.val()));
          $(this).attr("data-isDecode", 0).children('img').attr("src", "../icons/decode.png");
        }
      });
      $(document).on("input", ".search-input", function(e) {
        const val = $(this).val();
        searchFilter(val);
      });

      $(document).on("click", ".j-delete", function() {
        const $li = $(this).parents("li");
        if ($li.find(".j-add").length > 0) {
          $li.prev().find(".control").append(addIconElem(true));
        }
        $li.remove();
      });

      $(document).on("click", ".j-add", function() {
        const $li = $(this).parents("li");
        const $newLi = li("", "", addIconElem(true));;
        $li.parent().append($newLi);
        $li.find('.j-add').remove();
      });

      $(document).on("click", ".refresh", function() {
        const list = $(".list li");
        const length = list.length;
        let params = "";
        for (let i = 0; i < length; i++) {
          const li = list.eq(i);
          const paramName = li.find(".param-name").text() || li.find(".param-name").val();
          const paramValue = li.find(".param-value").val();
          if (paramName && paramValue) {
            params += `${paramName}=${paramValue}&`;
          }
        }
        sendMessage({
          result: 0,
          type: 1,
          msg: params.slice(0, -1),
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
