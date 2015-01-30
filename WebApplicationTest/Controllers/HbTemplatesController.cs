using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplicationTest.Controllers
{
    public class HbTemplatesController : Controller
    {
        // GET: HbTemplates
        public ActionResult DeleteStudent()
        {
            return PartialView();
        }

    }
}