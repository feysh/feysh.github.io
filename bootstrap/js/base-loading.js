/*******************************************
 * 
 * 创建说明：Base=>页面加载（loading）效果
 * 
 * 修改人：
 * 修改时间：
 * 修改说明：
 * 
*********************************************/

//获取浏览器页面可见高度和宽度
var _PageHeight = document.documentElement.clientHeight,
    _PageWidth = document.documentElement.clientWidth;
//计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0,
    _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;
//在页面未加载完毕之前显示的loading Html自定义内容
var _LoadingHtml = '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#f3f8ff;opacity:1;filter:alpha(opacity=80);z-index:10000;"><div style="position: absolute; cursor1: wait; left: ' + _LoadingLeft + 'px; top:' + _LoadingTop + 'px; width: auto; height: 57px; line-height: 57px; padding-left: 50px; padding-right: 5px; background: #fff url(bootstrap/img/loading.gif) no-repeat scroll 5px 10px; border: 2px solid #95B8E7; color: #696969; font-family:\'Microsoft YaHei\';">Downloading ......</div></div>';
//呈现loading效果

function showloading(){
	// document.write(_LoadingHtml);
	// document.write(_LoadingHtml);
	var dom = document.querySelector("#modal-loading");
dom.innerHTML +=_LoadingHtml;
}
//window.onload = function () {
//    var loadingMask = document.getElementById('loadingDiv');
//    loadingMask.parentNode.removeChild(loadingMask);
//};

//监听加载状态改变
// document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function hiddenLoading() {
        var dom = document.querySelector("#modal-loading");
        var loadingMask = document.getElementById('loadingDiv');
        // dom.innerHTML = '';
        $('#modal-loading').html("");
}


// loading btn
  var iTime = 5;
  var Account;
  function RemainTime(valueid,valueinfo){
      // console.log(valueid + '---')
      document.getElementById(valueid).disabled = true;
      var iSecond,sSecond="",sTime="";
      if (iTime >= 0){
          iSecond = parseInt(iTime%60);
          iMinute = parseInt(iTime/60);
          if (iSecond >= 0){
              if(iMinute>0){
                  sSecond = iMinute + "" + iSecond + "";
              }else{
                  sSecond = iSecond + "";
              }
          }
          sTime=sSecond;
          if(iTime==0){
              clearTimeout(Account);
              sTime="请稍后";
              iTime = 5;
              document.getElementById(valueid).disabled = false;
          }else{
              Account = setTimeout(function(){RemainTime(valueid,valueinfo)},1000);
              iTime=iTime-1;
          }
      }else{
          sTime='No Time';
      }
      document.getElementById(valueid).value =valueinfo+iTime;
      if(iTime  == 0 || iTime == 5){
        document.getElementById(valueid).value =valueinfo;
      }
  }

  // var iTimes = 5;
  // var Accounts;
  // function RemainTimes(valueid,valueinfo){
  //     // console.log(valueid + '---')
  //     document.getElementById(valueid).disabled = true;
  //     var iSecond,sSecond="",sTime="";
  //     if (iTimes >= 0){
  //         iSecond = parseInt(iTimes%60);
  //         iMinute = parseInt(iTimes/60);
  //         if (iSecond >= 0){
  //             if(iMinute>0){
  //                 sSecond = iMinute + "" + iSecond + "";
  //             }else{
  //                 sSecond = iSecond + "";
  //             }
  //         }
  //         sTime=sSecond;
  //         if(iTimes==0){
  //             clearTimeout(Accounts);
  //             sTime=""+valueinfo;
  //             iTimes = 5;
  //             document.getElementById(valueid).disabled = false;
  //         }else{
  //             Accounts = setTimeout(function(){RemainTimes(valueid,valueinfo)},1000);
  //             iTimes=iTimes-1;
  //         }
  //     }else{
  //         sTime='No Time';
  //     }
  //     document.getElementById(valueid).value = sTime;
  // }
