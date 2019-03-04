layui.use(['element', "layer"], function () {
  const element = layui.element;
  const layer = layui.layer
  const $ = layui.$

  //$submit = $(".layui-show button[type!=reset]")
  let $username = $(".layui-show input[name=username]")
  let $password = $(".layui-show input[name=password]")
  let $password2 = $(".layui-show input[name=confirmPWD]")

  /* $username.on("input", () => {
    let username = $username.val()
    if(val.length < 6)return
  }) */


  $password.on("blur", function () {
    const pwd = $password.val();
    if (!/^\w{4,12}$/.test($(this).val())) {
      layer.msg("密码必须大于4位数")
      $(this).val("")
    }
  })

  $password2.on("blur", function () {
    const pwd = $password.val();
    if ($(this).val() !== pwd) {
      layer.msg("两次密码不一致")
      $(this).val("")
    }
  })
});