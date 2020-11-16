var EID_val = '';
var ICCID_val = '';
var APDU_a = '1'; // 03+eid 返回APDU，a
var APDU_b = ''; // 卡片 发 a 回 b
var UPDATE_OK = ''; // DP POST: data=04 + b(去掉前2字符) 回 UPDATE_OK
var APDU_c = ''; // DP POST: data=05 + b(去掉前2字符) 回 APDU,c1,c2,c3,c4
var APDU_d = ''; // 卡片 顺序发 c1~c4 回 d
var DP_d = ''; // DP POST: DP POST: data= d
var provisioning_id = ''; // fnViewProvisioning
var view_provisioning = '';

function fnGetEid(){
    
    // 获取系统中所安装读卡器名称
    // fnListReaders();
    // 设置所使用的读卡器名称
    if(fnListReaders() == "OK"){
        // 连接智能卡
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            // 重置读卡器获取atr值
            fnGetATR();
            // 执行apdu命令
            if(fnRunAPDU('00a4040409676F74656C6C417070',"_1")){
                return;
            };
            if(fnGetSW()){
                return;
            };
            if(fnRunAPDU('001A000010',"_2")){
                return;
            };
            // 获取命令返回状态字
            if(fnGetSW()){
                return;
            };
            // 获取EID
            fnGetRetData('EID');
            showloading();
            var checkValue_ = fnCheckICCID();
            if(checkValue_=="false"){
                hiddenLoading();
                return;
            }else{
               fnGetDP_iccid();
            }   
        }
    }
}

// 获取ViewProvisioning
function fnViewProvisioning(){
    // 获取系统中所安装读卡器名称
    // fnListReaders();
    if(fnListReaders() == "OK"){
        // 连接智能卡
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            // 重置读卡器获取atr值
            fnGetATR();
            // 执行apdu命令
            if(fnRunAPDU('00a4040409676F74656C6C417070',"_3")){
                return;
            };
             // 获取命令返回状态字
            if(fnGetSW()){
                return;
            };
            if(fnRunAPDU('00A9000000',"_4")){
                return;
            };
            // 获取命令返回状态字
            if(fnGetSW()){
                return;
            };
            // 获取EID
            fnGetRetData('provisioning_id');
            if(provisioning_id.length >= 20){
                var I_length = provisioning_id.length / 20 ;
                 var provisioning_list = []
                for(var i = 0; i< I_length ;i++){
                      provisioning_list[i] = ChangeNums(provisioning_id.substring(i*20,(i+1)*20));
                }
                // 断开卡片
                fnCardOff();
                // 将读卡器释放
                fnFreeReader();
                //alert(provisioning_list);

                sAlert("warning1",provisioning_list);
            }else{
                // 断开卡片
                fnCardOff();
                // 将读卡器释放
                fnFreeReader();
                alert("No Profile");
                // alert(ICCID_val);
                // return;
            }
        }
    }
}
//provisioning
function fnDelProvisioning() {
     if(fnListReaders() == "OK"){
        // 连接智能卡
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            // 重置读卡器获取atr值
            fnGetATR();
            // 执行apdu命令
            if(fnRunAPDU('00a4040409676F74656C6C417070',"_5")){
                return;
            };
             // 获取命令返回状态字
            if(fnGetSW()){
                return;
            };
            if(document.getElementById("provisioning_select").value==""){
                alert('No Profile');
                return;
            }
            var apdu_value = '00E290000CBF33'+document.getElementById("provisioning_select").value;
            if(fnRunAPDU('00E290000CBF33'+document.getElementById("provisioning_select").value,"_6")){
                return;
            };
            // 获取命令返回状态字
            if(fnGetSW()){
                return;
            };
            // 获取EID
            fnGetRetData('provisioning_id');

            var delprovisioning = provisioning_id;
            alert("SIM is deleted successfully with selected profile");
            fnCardOff();
            // 将读卡器释放
            fnFreeReader();
            // fnGetICCID_select();
            $('#cancel_btn').click();
            }
        }
}
function fnCheckICCID(){
    // 执行apdu命令
    if(fnRunAPDU('00a4040409676F74656C6C417070',"_7")){
        return;
    };
     // 获取命令返回状态字
    if(fnGetSW()){
                return;
            };
    if(fnRunAPDU('80E2900002BF2D',"_8")){
        return;
    };
    // 获取命令返回状态字
    if(fnGetSW()){
                return;
            };
    // 获取EID
    fnGetRetData('ICCID');
    if(ICCID_val.length >= 22){
        var I_length = ICCID_val.length / 22 ;
         var ICCID_list = []
        for(var i = 0; i< I_length ;i++){
              ICCID_list[i] = ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2));
              if(document.getElementById("ChooseSIMCard").value ==ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2)) ){
                hiddenLoading();
                alert("Same profile has been downloaded in the SIM card, cannot be download again.");
                return "false";
              }
        }
        return "true";
    }else{
        return "true";
    }
}
// DP
// A_id       输出id
// A_data     post数据前缀
// A_valueid  获取值id
// A_num  截取字符串数字  ， 默认为空--不截取
function fnAjaxAPDU(A_id,A_data,A_valueid,A_num) {
    // if(document.getElementById("GetEid").innerHTML == ''){
    //     fnGetEid();
    // }
    var data_value = A_valueid;
    var A_value = '';
    if(A_data == ''){
        if(!A_num){
            A_value = data_value;
        }else{
            A_value = data_value.substring(A_num);
        }
    }else{
        if(!A_num){
            A_value = A_data + data_value;
        }else{
            A_value = A_data + data_value.substring(A_num);
        }

    }
    ajax({
        type:"POST",
        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es9plus/m2m/sendRes",
        contentType:"application/x-www-form-urlencoded;",
        // async : "true",
        async : false,
        //dataType:"json",
        data: {'data': A_value},
        beforeSend:function(){
            //some js code
        },
        success:function(msg){
            if(A_id == 'APDU_a'){
                if(msg.responseText.indexOf("APDU")==-1){ 
                    //do something
                    hiddenLoading();
                    alert("There are problems in download profile from server (3)");
                    
                }else{
                    APDU_a = msg.responseText;
                    // console.log(APDU_a + '---APDU_a--1--')
                    fnRunAPDUBACK('APDU_b',APDU_a,5);
                }
            }
            if(A_id == 'UPDATE_OK'){
                if(msg.responseText.indexOf("UPDATE_OK")==-1){
                    //do something
                    hiddenLoading();
                    alert("There are problems in download profile from server (4)");
                }else{
                    UPDATE_OK = msg.responseText;
                    fnAjaxAPDU_c1_c4('APDU_c','05',APDU_b,2);
                }   
            }
        },
        error:function(e){
            hiddenLoading();
            if(A_id == 'APDU_a'){
                alert("There are problems in download profile from server (3.1)");
            }
            if(A_id == 'UPDATE_OK'){
                alert("There are problems in download profile from server (4.1)");
            }
        }
    })
}

function fnGetDP_iccid(){
    var data_val = new Date().getTime();
   
    ajax({
            type:"POST",
            url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es2plus/downloadOrder",
            contentType:"application/json;",
            async : false,
            dataType:"json",
            data: JSON.stringify({
               "orderId":"twtest_"+ data_val,
                "eid":EID_val+"",
                "iccid":document.getElementById("ChooseSIMCard").value
            }),
            beforeSend:function(){
                //some js code      
            },
            success:function(msg){
                if(msg.responseText.indexOf("Executed-Success")==-1){ 
                //do something
                    hiddenLoading();
                    alert("There are problems in download profile from server (1)");
                }else{
                //do something
                   ajax({
                        type:"POST",
                        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es2plus/confirmOrder",
                        contentType:"application/json;",
                        async : false,
                        //dataType:"json",
                        data: JSON.stringify({
                            'eid':EID_val,
                            'iccid':document.getElementById('ChooseSIMCard').value,
                            'releaseFlag': true 
                        }),
                        beforeSend:function(){
                            //some js code
                        },
                        success:function(msg){
                            if(msg.responseText.indexOf("Executed-Success")==-1){ 
                                //do something
                                hiddenLoading();
                                alert("There are problems in download profile from server (2)");
                            }else{
                            //do something
                                fnAjaxAPDU('APDU_a','03',EID_val);
                            }
                        },
                        error:function(e){
                            hiddenLoading();
                            alert("There are problems in download profile from server (2.1)");
                            console.log("error" + "--" + e);

                        }
                    })
                }
            },
            error:function(e){
                hiddenLoading();
                alert("There are problems in download profile from server (1.1)");
            }
        })
}


function fnRunAPDUBACK(A_id,A_value,A_num) {
    // body...
    // console.log(A_value + '---back')
    var data_value = A_value;
    var A_valueback = '';
    if(!A_num){
        A_valueback = data_value;
    }else{
        A_valueback = data_value.substring(A_num);
    }   
    lReturn = myScc.RunAPDU(A_valueback);
      // console.log("CardOn----------- err:"+lReturn);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（"+lReturn+"_9"+"）.");
        return;
    }
    // 获取命令返回状态字
    if(fnGetSW()){
                return;
            };
    // 获取返回数据
    fnGetRetData(A_id);
    fnAjaxAPDU('UPDATE_OK','04',APDU_b,2);
    
}

function fnRunAPDU_C(A_id,A_value) {
    var A_valueback =A_value;
    var result = A_valueback.split(",");
    // console.log(A_valueback + '------A_valueback')
    lReturn = myScc.RunAPDU(result[1]);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（C1_"+lReturn+"）.");
        return;
    }
    lReturn = myScc.RunAPDU(result[2]);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（C2_"+lReturn+"）.");
        return;
    }
    lReturn = myScc.RunAPDU(result[3]);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（C3_"+lReturn+"）.");
        return;
    }
    lReturn = myScc.RunAPDU(result[4]);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（C4_"+lReturn+"）.");
        return;
    }
    // 获取命令返回状态字
    if(fnGetSW()){
                return;
            };
    // 获取返回数据
    fnGetRetData(A_id);
    sRes = myScc.GetRetData();
    ajax({
        type:"POST",
        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es9plus/m2m/sendRes",
        contentType:"application/x-www-form-urlencoded;",
        // async : "true",
        async : false,
        //dataType:"json",
        data: {'data': sRes},
        beforeSend:function(){
            //some js code
        },
        success:function(msg){
            // document.getElementById(A_id).innerHTML = msg.responseText;
            // console.log(msg.responseText+ '------msg.responseText');
            hiddenLoading();
            if(msg.responseText.indexOf("CTRL")==-1){ 
            //do something
                alert("Failed to update SIM with selected profile");
            }else{
            //do something
                alert("SIM is updated successfully with selected profile");
            }
        },
        error:function(e){

            hiddenLoading();
            alert("There are problems in download profile from server (6.1)");
        }
    })
}
function fninputAPDU(A_id){
    if(!A_id){
        alert("请输入指令")
        return;
    }
    lReturn = myScc.RunAPDU(A_id);
    // document.getElementById("SetReader").innerHTML ="状态：0是成功----" + lReturn;
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（"+lReturn+"_15"+"）.");
        return;
    }
    sSW = myScc.GetSW();
    fnGetRetData("GetRetData");
}

// 获取iccid
function fnGetICCID(){
    // 获取系统中所安装读卡器名称
    // fnListReaders();
    if(fnListReaders() == "OK"){
        // 连接智能卡
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            // 重置读卡器获取atr值
            if(fnGetATR()){
                return;
            };
            // 执行apdu命令
            if(fnRunAPDU('00a4040409676F74656C6C417070',"_10")){
                return;
            };
            // 获取命令返回状态字
            if(fnGetSW()){
                return;
            };
            if(fnRunAPDU('80E2900002BF2D',"_11")){
                return;
            };
            // 获取命令返回状态字
            if(fnGetSW()){
                return;
            };
            // 获取EID
            fnGetRetData('ICCID');
            if(ICCID_val.length >= 22){
                var I_length = ICCID_val.length / 22 ;
                 var ICCID_list = []
                // for(var i = 0; i< I_length ;i++){
                for(var i = I_length-1; i>= 0 ;i--){
                      ICCID_list[i] = ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2));
                }
                        // 断开卡片
                        fnCardOff();
                        // 将读卡器释放
                        fnFreeReader();
                        // alert(ICCID_list);
                        sAlert("warning3",ICCID_list);

            }else{
                        // 断开卡片
                        fnCardOff();
                        // 将读卡器释放
                        fnFreeReader();
                        alert("No Profile");
                // alert(ICCID_val);
                // return;
            }
        }
    }
}

// 获取iccid-modal
function fnGetICCID_select(){
    // 获取系统中所安装读卡器名称
    // fnListReaders();
    var provisioning_select = document.getElementById("provisioning_select");
    provisioning_select.innerHTML = '';
    if(fnListReaders() == "OK"){
        $("#myModalbtn").click();
        // 连接智能卡
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            // 重置读卡器获取atr值
            fnGetATR();
            // 执行apdu命令
            if(fnRunAPDU('00a4040409676F74656C6C417070',"_12")){
                return;
            };
             // 获取命令返回状态字
            if(fnGetSW()){
                return;
            };
            if(fnRunAPDU('80E2900002BF2D',"_13")){
                return;
            };
            // 获取命令返回状态字
            if(fnGetSW()){
                return;
            };
            // 获取EID
            fnGetRetData('ICCID');
            if(ICCID_val.length >= 22){
                var I_length = ICCID_val.length / 22 ;
                var ICCID_list = []
                
                // for(var i = 0; i< I_length ;i++){
                for(var i = I_length-1; i>= 0 ;i--){
                      var objOption = document.createElement("OPTION");
                      objOption.text = ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2));
                      objOption.value = ICCID_val.substring(i*22,(i+1)*22).substring(2);
                      provisioning_select.options.add(objOption);
                      // ICCID_list[i] = ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2));
                }
                        // 断开卡片
                        fnCardOff();
                        // 将读卡器释放
                        fnFreeReader();
                        // alert(ICCID_list);
            }else{
                        // 断开卡片
                        fnCardOff();
                        // 将读卡器释放
                        fnFreeReader();
            }

        }
    }
}


// DP
// A_id       输出id
// A_data     post数据前缀
// A_valueid  获取值id
// A_num  截取字符串数字  ， 默认为空--不截取
function fnAjaxAPDU_c1_c4(A_id,A_data,A_valueid,A_num) {
    // if(document.getElementById("GetEid").innerHTML == ''){
    //     fnGetEid();
    // }
    var data_value = A_valueid;
    var A_value = '';
    if(A_data == ''){
        if(!A_num){
            A_value = data_value;
        }else{
            A_value = data_value.substring(A_num);
        }
    }else{
        if(!A_num){
            A_value = A_data + data_value;
        }else{
            A_value = A_data + data_value.substring(A_num);
        }

    }
    ajax({
        type:"POST",
        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es9plus/m2m/sendRes",
        contentType:"application/x-www-form-urlencoded;",
        // async : "true",
        async : false,
        //dataType:"json",
        data: {'data': A_value},
        beforeSend:function(){
            //some js code
        },
        success:function(msg){
            if(msg.responseText.indexOf("ERROR")!=-1){ 
                //do something
                hiddenLoading();
                alert("There are problems in download profile from server (5)");
            }else{
                //do something
                APDU_c = msg.responseText;
                fnRunAPDU_C('APDU_d',APDU_c);
            }    
        },
        error:function(e){
            alert("There are problems in download profile from server (5.1)");
            console.log("error--"+ e);
        }
    })
}

function fnListReaders(){
    //此处为获取系统中所安装读卡器名称的借口
    var ChooseReaders = document.getElementById("ChooseReader");
    ChooseReaders.innerHTML = '';
    try {
        s=new String(myScc.ListReaders());
         }
    catch(err){
         // console.log(err);
         hiddenLoading(); 
         alert("Please use IE browser, install and activate LPA plugin.");
         return;
    }
         cars=s.split("||");
         if(cars.length==1){
            hiddenLoading();
            alert("There is no SIM card reader found.");
            return;
         } else{
            for(var i = 0;i<cars.length-1;i++){
                var objOption = document.createElement("OPTION");
                objOption.text = cars[i];
                objOption.value = cars[i];
                ChooseReaders.options.add(objOption);
            }
         }
         // console.log(ChooseReaders.value);
        return "OK";
}
//设置所使用的读卡器名称
function fnSetReader(val){
    lReturn = myScc.SetReader(val);
    if(lReturn!=0){
        hiddenLoading();
        alert("There are problems reading SIM card reader.");
        return false;
    }
    return true;
}
function fnConnect_Card(val) {
    // body...
    lReturn = myScc.SetReader(val);
    if(lReturn!=0){
        hiddenLoading();
        alert("There are problems reading SIM card reader.");
        return;
    }
    lReturn = myScc.CardOn();
    if(lReturn!=0){
        hiddenLoading();
        alert("There are problems connected to SIM card reader.");
        return;
    }
    return true;

    
}
//连接智能卡
function fnCardOn(event) {
    lReturn = myScc.CardOn();
    if(lReturn!=0){
        hiddenLoading();
        alert("There are problems connected to SIM card reader.");
        return;
    }
}
//重置读卡器获取atr值
function fnGetATR() {
    sATR = myScc.GetATR();
    console.log(sATR + '-------sATR ---------');
}
//执行apdu命令
function fnRunAPDU(val,err){
    lReturn = myScc.RunAPDU(val);
    if(lReturn!=0){
        hiddenLoading();
        alert("There are problems in communicating with SIM card（"+lReturn+err+"）.");
        return true;
    }
    return false;
}
//获取命令返回状态字
function fnGetSW() {
    //获取命令返回状态字
    sSW = myScc.GetSW();
    if(sSW!=9000){
        if(sSW.substring(0,2)=="61" || sSW.substring(0,2)=="91"){
            if(fnRunAPDU("00C00000"+sSW.substring(2),"_14")){
                return;
            };
            fnGetSW();
        }
        else if(sSW == "6A84"){
            hiddenLoading();
            alert("Cannot download profile to SIM card. There are already 10 profiles in SIM card. ");
            return true;
        }else{
            hiddenLoading();
            alert("Card internal error（"+sSW+").");
            return true;
        }
    }
    return false;
}
//获取返回数据
function fnGetRetData(val) {
    sRes = myScc.GetRetData();
    if(val == 'EID'){
        EID_val = sRes
        return EID_val;
    }
    if(val == 'ICCID'){
        ICCID_val = sRes
        return ICCID_val;
    } 
    if(val == 'APDU_b'){
        APDU_b = sRes
        return APDU_b;
    }
    if(val == 'APDU_d'){
        APDU_d = sRes
        return APDU_d;
    } 
    if(val == 'provisioning_id'){
        provisioning_id = sRes
        return provisioning_id;
    }  
    
}

//获取返回数据
function fnGetRetData_value() {
    sRes = myScc.GetRetData();
    return sRes;
}

function fnCardOff(){
    lReturn = myScc.CardOff();
    if(lReturn!=0){
        hiddenLoading();
        alert("There are problems ejecting SIM card / card reader");
        return;
    }
}
function fnFreeReader(){
    lReturn = myScc.FreeReader();

    if(lReturn!=0){
        // console.log("FreeReader return "+lReturn);
        hiddenLoading();
        alert("There are problems ejecting SIM card reader");
        return
    }
    // console.log(lReturn + '-------lReturn ---------将读卡器释放');
}

// 使用原生js 封装ajax
function ajax(){
    var ajaxData = {
        type:arguments[0].type || "GET",
        url:arguments[0].url || "",
        async:arguments[0].async || "true",
        data:arguments[0].data || null,
        dataType:arguments[0].dataType || "text",
        contentType:arguments[0].contentType || "application/x-www-form-urlencoded",
        beforeSend:arguments[0].beforeSend || function(){},
        success:arguments[0].success || function(){},
        error:arguments[0].error || function(){}
    }
    ajaxData.beforeSend()
    var xhr = createxmlHttpRequest();
    //xhr.timeout = 60000;
    //xhr.responseType=ajaxData.dataType;
    try {
        
        
        xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);
         }
    catch(err){
         console.log(err); 
         hiddenLoading();
         alert("There are problems in download profile from server (0).");
         return;
    }
    


    // header
    // xhr.withCredentials = true;
    // xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
    // xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    // xhr.setRequestHeader("Access-Control-Allow-Methods", "GET, PUT, POST");
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "https://c9dp.roam2free.com:8443");
    // xhr.setRequestHeader("Access-Control-Max-Age","86400");
    

    // xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    // xhr.setRequestHeader("Access-Control-Allow-Methods", "GET, PUT, POST");
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "https://c9dp.roam2free.com:8443");
    // // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    // xhr.setRequestHeader("Access-Control-Max-Age","86400");
   
    xhr.setRequestHeader("Content-Type",ajaxData.contentType);
    xhr.send(convertData(ajaxData.data));
    // xhr.send(ajaxData.data);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(xhr.status == 200){
                ajaxData.success(xhr)
            }else{
                ajaxData.error(xhr)
            }
        }
    }
}

function createxmlHttpRequest() {     
return new XMLHttpRequest()
        // var mf_change=false;   
        //  try   
        //  {   
             
        //   mf_change = new ActiveXObject("Msxml2.XMLHTTP");   
          
        //  }   
        //  catch (e)   
        //  {   
        //     try   
        //     {   
        //       mf_change = new ActiveXObject("Microsoft.XMLHTTP");   
        //     }   
        //     catch (E)   
        //     {   
        //       mf_change = false;   
        //     }   
        //  }  
        //  if (!mf_change && typeof XMLHttpRequest!='undefined')   
        //  {   
        //    mf_change = new XMLHttpRequest();   
        //  }   
        //  // alert(JSON.stringify(mf_change));
        //  return mf_change;  


    // if (window.ActiveXObject) {
    //     return new ActiveXObject("Microsoft.XMLHTTP");
    //      // xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    // } else if (window.XMLHttpRequest) {
    //     return new XMLHttpRequest();
    // }

    // if(window.ActiveXObject){
    //     var ieArr=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP","Microsoft.XMLHTTP"]; 
    //     for(var i=0;i<ieArr.length;i++)
    //     {
    //         var xmlhttp= new ActiveXObject(ieArr[i]);
    //     }
    //     return xmlhttp;
    //     } else if(window.XMLHttpRequest){
    //         return new XMLHttpRequest();
    //     } 
}

function convertData(data){
    if( typeof data === 'object' ){
        var convertResult = "" ;
        for(var c in data){
            convertResult+= c + "=" + data[c] + "&";
        }
        convertResult=convertResult.substring(0,convertResult.length-1)
        return convertResult;
    }else{
        return data;
    }
}
//传入字符串进行互换，返回结果
function ChangeNums(arr){
  var v_array = arr.split("");
  var rs=new Array();
  var value = "";
  for(var i=0;i<v_array.length;i++){
    if((i%2)!=0){//奇偶判断，这是奇数
    rs[i]=v_array[i-1];
    }else{//这是偶数
      rs[i]=v_array[i+1];
    }
  }
  value=rs.join("");
  return value;
}