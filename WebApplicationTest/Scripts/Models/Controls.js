$(function () {    
    ActivateControls();

    $('body').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
        //alert("1");

        //$("#myCreateModalContent").html("");
        //$("#myEditModalContent").html("");        
    });
});

function ActivateControls() {
    ActivateCalendars();
}

function ActivateCalendars(id) {
    // Calendar controls (Spanish date format)
    //$('#' + id + ' .datepicker').datetimepicker({


    $('.datepicker').datetimepicker({
        format: 'DD/MM/YYYY',
        autoclose: true,
        language: 'es',
        pickTime: false
    });
}