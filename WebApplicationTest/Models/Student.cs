using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplicationTest.Models
{
    public class Student
    {
        public int UniqueId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime BirthDate { get; set; }
    }
}