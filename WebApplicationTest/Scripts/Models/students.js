var urlPath = "/api";

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

        self.create = function(data) {
            var item = {
                Name: data.Name(),
                Surname: data.Surname(),
                Birthdate: data.Birthdate(),
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
                Birthdate: data.Birthdate(),
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
       
        // Load a student
        self.LoadItem = function (id, item) {
            $.ajax({
                type: "GET",
                url: urlPath + '/student/' + id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    item.Uniqueid(id);
                    item.Name(data.Name);
                    item.Surname(data.Surname);
                    item.Birthdate(moment(data.BirthDate).format("DD/MM/YYYY"));

                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        }

        // Clean data a student
        self.CleanItem = function(item) {
            item.Uniqueid("");
            item.Name("");
            item.Surname("");
            item.Birthdate("");
        }

        self.MapToVm = function (data, viewModel) {

            for (var property in data) {
                if (data.hasOwnProperty(property) && viewModel[property]) {
                    viewModel[property](data[property]);
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
        
        // Events
        self.createdialog = function () {
            self.CleanItem(viewModelStudent);

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
            ActivateControls();

            console.log(self);

            ko.applyBindings(viewModelStudent, document.getElementById("create"));

            $('#CreateModal').modal();
        }

        self.editdialog = function (data) {
            self.CleanItem(viewModelStudent);

            self.MapToVm(ko.toJS(data), viewModelStudent);

            if ($('.datepicker').data("DateTimePicker")) {
                $('.datepicker').data("DateTimePicker").destroy();
            }

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

            ActivateControls();
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

                self.MapToVm(item, student);
                
                $('#EditModal').modal('hide');
            }).fail(function (response) {
                alert("¡Error!");
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
                    400: function(xhr) {
                        var errors = JSON.parse(xhr.responseText);
                        var strErrors = "<ul>";

                        $.each(errors, function(index, err) {
                            strErrors += "<li>" + err + "</li>";
                        });

                        strErrors += "</ul>";

                        $("#CreateModalErrors").html(strErrors);
                        $("#CreateModalErrors").closest("div").removeClass("hidden");
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
            
            // Edit
            console.log("To implement");
        }

    }

    function Map(student) {
        if (student != null) {
            this.Uniqueid = ko.observable(student.UniqueId);
            this.Name = ko.observable(student.Name);
            this.Surname = ko.observable(student.Surname);
            this.Birthdate = ko.observable(moment(student.BirthDate).format("DD/MM/YYYY"));

            this.NameHtml = ko.dependentObservable(function() {
                return '<a class="btn-edit" data-id="' + this.Uniqueid() + '" href="#">' + this.Name() + "</a>";
            }, this);            
        }
    }

});