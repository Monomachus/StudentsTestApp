﻿var urlPath = "/api";
var spanishDateFormat = "DD/MM/YYYY";

String.prototype.endsWith = function (str) {
    var lastIndex = this.toUpperCase().lastIndexOf(str.toUpperCase());
    return (lastIndex !== -1) && (lastIndex + str.length === this.length);
}

$(function () {

    var viewModelStudent = new StudentViewModel();    

    var viewModel = new StudentsViewModel();
    viewModel.LoadAll();
  
    viewModel.loadTemplates();

    ko.applyBindings(viewModel, document.getElementById("list"));

    function StudentViewModel() {
        var self = this;

        self.Uniqueid = ko.observable("");
        self.Name = ko.observable("");
        self.Surname = ko.observable("");
        self.Birthdate = ko.observable(new Date());
        self.BirthdateString = ko.observable("");

        self.create = function(data) {
            var item = {
                Name: data.Name(),
                Surname: data.Surname(),
                Birthdate: moment(data.Birthdate()).format(spanishDateFormat)
            };

            viewModel.CreateItem(item);

        };

        self.deleteFn = function (data) {
            var idStudent = data.Uniqueid();

            viewModel.DeleteItem(idStudent);
        }

        self.update = function (data) {
            
            var item = {
                Uniqueid: data.Uniqueid(),
                Name: data.Name(),
                Surname: data.Surname(),
                Birthdate: data.BirthdateString(),
            };

            viewModel.UpdateItem(item);
        };

    };
    
    function StudentsViewModel() {
        var self = this;

        self.students = ko.observableArray([]);
        self.LoadedEditDialog = ko.observable(false);
        self.LoadedCreateDialog = ko.observable(false);
        self.LoadedDeleteDialog = ko.observable(false);
       
        // Clean data a student
        self.CleanItem = function(item) {
            item.Uniqueid("");
            item.Name("");
            item.Surname("");
            item.Birthdate(new Date());
            item.BirthdateString("");
        }

        self.MapToVm = function (data, viewModel) {

            for (var property in data) {
                if (data.hasOwnProperty(property) && viewModel[property]) {
                    if (property.endsWith("date")) {
                        viewModel[property](moment(data[property + "String"], spanishDateFormat));
                    } else {
                        viewModel[property](data[property]);
                    }
                }
            }

        }

        // Load all students
        self.LoadAll = function () {            
            $.ajax({
                type: "GET",
                url: urlPath + '/Student',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    
                    var mappedData = ko.utils.arrayMap(data, function (item) {
                        return new Map(item);
                    });

                    self.students(mappedData);
                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        }
        
        self.CleanErrorDiv = function (idModalErrors) {
            $("#" + idModalErrors).html("");
            $("#" + idModalErrors).closest("div").addClass("hidden");
        }

        // Events
        self.createdialog = function () {
            self.CleanItem(viewModelStudent);

            self.CleanErrorDiv("CreateModalErrors");
            
            if ($('.datepicker').data("DateTimePicker")) {
                $('.datepicker').data("DateTimePicker").destroy();                
            }

            var template = Handlebars.getTemplate('Create');
            var html = template();

            $("#myEditModalContent").html("");
            $("#myCreateModalContent").html(html);

            if (self.LoadedCreateDialog() == true) {
                ko.cleanNode(document.getElementById("create"));
            }
            else {
                self.LoadedCreateDialog(true);
            }

            console.log(self);

            ko.applyBindings(viewModelStudent, document.getElementById("create"));

            $('#CreateModal').modal();
        }

        self.editdialog = function (data) {
            self.CleanErrorDiv("EditModalErrors");

            self.MapToVm(ko.toJS(data), viewModelStudent);

            var template = Handlebars.getTemplate('Create');
            var html = template(data);

            $("#myEditModalContent").html(html);
            $("#myCreateModalContent").html("");

            if (self.LoadedEditDialog() == true) {
                ko.cleanNode(document.getElementById("edit"));
            }
            else {
                self.LoadedEditDialog(true);
            }

            console.log(self);

            ko.applyBindings(viewModelStudent, document.getElementById("edit"));

            $('#EditModal').modal();
        }

        self.deletedialog = function (data) {
            self.CleanItem(viewModelStudent);

            var template = Handlebars.getTemplate('Delete');
            var html = template(ko.toJS(data));

            viewModelStudent.Uniqueid(data.Uniqueid());

            $("#myDeleteModalContent").html(html);

            if (self.LoadedDeleteDialog() == true) {
                ko.cleanNode(document.getElementById("delete"));
            }
            else {
                self.LoadedDeleteDialog(true);
            }
          
            console.log(self);

            ko.applyBindings(viewModelStudent, document.getElementById("delete"));

            $('#DeleteModal').modal();
        }
       
        self.UpdateItem = function(item) {
            $.ajax({
                data: JSON.stringify(item),
                type: "PUT",
                url: urlPath + '/student/' + item.Uniqueid,
                contentType: "application/json; charset=utf-8"
                // this is not have simple HttpCode.OK fail -> dataType: "json"
            }).done(function (response) {
                var student = ko.utils.arrayFirst(viewModel.students(), function (st) {
                    return st.Uniqueid() == item.Uniqueid;
                });

                item["BirthdateString"] = item["Birthdate"];
                item["Birthdate"] = moment(item["Birthdate"], spanishDateFormat);

                self.MapToVm(item, student);
                
                $('#EditModal').modal('hide');
            }).fail(function (response) {
                self.OnErrors(response, "EditModalErrors");
            });
        };

        self.CreateItem = function(item) {        
            $.ajax({
                data: JSON.stringify(item),
                type: "POST",
                url: urlPath + '/student',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                statusCode: {
                    201: function(data) {
                        var newitem = new Map(data);
                        viewModel.students.push(newitem);

                        $('#CreateModal').modal('hide');
                    },
                    404: function() {
                        alert("¡Error!");
                    },
                    400: function (xhr) {
                        self.OnErrors(xhr, "CreateModalErrors");
                    }
                }

            });
        };

        self.DeleteItem = function (id) {
            $.ajax({
                type: "DELETE",
                url: urlPath + '/student/' + id,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (response) {

                viewModel.students.remove(function (student) {
                    return student.Uniqueid() === id;
                });

                $('#DeleteModal').modal('hide');
            }).fail(function (response) {
                alert("¡Error!");
            });
        }

        self.loadTemplates = function () {
            Handlebars.getExternalTemplate('Create', "/Dialogs/CreateStudent");

            Handlebars.getExternalTemplate('Delete', "/HbTemplates/DeleteStudent");
        }

        self.OnErrors = function (xhr, idModalErrors) {
            var errors = JSON.parse(xhr.responseText);
            var strErrors = "<ul>";

            if (errors && errors.ModelState) {
                $.each(errors.ModelState, function (index, err) {
                    strErrors += "<li>" + err + "</li>";
                });

                strErrors += "</ul>";

                $("#" + idModalErrors).html(strErrors);
                $("#" + idModalErrors).closest("div").removeClass("hidden");
            }
        }
    }

    function Map(student) {
        if (student != null) {
            this.Uniqueid = ko.observable(student.UniqueId);
            this.Name = ko.observable(student.Name);
            this.Surname = ko.observable(student.Surname);
            this.Birthdate = ko.observable(moment(student.BirthdateString, spanishDateFormat));
            this.BirthdateString = ko.observable(moment(student.BirthDate).format(spanishDateFormat));

            this.NameHtml = ko.dependentObservable(function() {
                return '<a class="btn-edit" data-id="' + this.Uniqueid() + '" href="#">' + this.Name() + "</a>";
            }, this);            
        }
    }

});