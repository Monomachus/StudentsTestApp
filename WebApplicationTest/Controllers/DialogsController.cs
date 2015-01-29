using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplicationTest.Controllers
{
    public class DialogsController : Controller
    {
        // GET: Dialogs
        public ActionResult CreateStudent()
        {
            return PartialView();
        }

        public ActionResult EditStudent()
        {
            return PartialView();
        }
    }
}