using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc.Html;

namespace WebApplicationTest.Models
{
    public class Students
    {
        private static List<Student> _students;

        public Students()
        {
            if (_students == null)
            {
                _students = new List<Student>
                            {
                                new Student
                                {
                                    UniqueId = 1,
                                    Name = "John",
                                    Surname = "Smith",
                                    BirthDate = DateTime.Parse("01/01/1975")
                                }
                            };
            }
        }

        public static List<Student> List()
        {
            return _students;
        }

        public static void Add(Student newstudent)
        {
            if (_students != null)
            {
                // Create UniqueId
                var lastStudent = _students.LastOrDefault();

                if (lastStudent != null)
                {                    
                    int uniqueId = lastStudent.UniqueId;
                    newstudent.UniqueId = uniqueId + 1;
                    
                }
                


                    _students.Add(newstudent);
            }
        }

        public static void Update(Student updatestudent)
        {
            if (_students != null)
            {
                int index = _students.FindIndex(x => x.UniqueId == updatestudent.UniqueId);
                if (index < 0)
                {
                    _students.Add(updatestudent);
                }
                else
                {
                    _students[index] = updatestudent;
                }

                /*var toUpdate = _students.SingleOrDefault(x => x.UniqueId == updatestudent.UniqueId);

                if (toUpdate != null)
                {
                    toUpdate.Name = updatestudent.Name;
                    toUpdate.Surname = updatestudent.Surname;
                    toUpdate.BirthDate = updatestudent.BirthDate;
                }*/
            }
        }

        public static void Delete(int idStudentToDelete)
        {
            if (_students != null)
            {
                var studentToDelete = _students.SingleOrDefault(x => x.UniqueId == idStudentToDelete);

                if (studentToDelete != null) 
                {
                    _students.Remove(studentToDelete);
                }
            }
        }
    }
}