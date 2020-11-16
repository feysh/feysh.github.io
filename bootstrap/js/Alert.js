
function sAlert(id, strContent) {
    var str = '<div id=modal'+id+'  class="modal hide yezi fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-body" style="word-break: break-all;;">' + strContent + '</div><div class="modal-footer" style="border: none;background: #fff;"><button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Confirm</button></div></div>';

    if(document.getElementById("divmodal"))
    {
        var alertmodal = document.createElement("div");
        alertmodal.id = 'divmodal';
        alertmodal.innerHTML = str;
        $("#divmodal").html("");
        $("#divmodal").html(str);
        $('#modal'+id).modal('show');
    }
    else{
        var alertmodal = document.createElement("div");
        alertmodal.id = 'divmodal';
        alertmodal.innerHTML = str;
        document.body.appendChild(alertmodal);
        $('#modal'+id).modal('show');
    }
}






