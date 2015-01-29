using System;
using System.Globalization;
using System.Linq.Expressions;
using System.Text;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;

namespace WebApplicationTest.Helpers
{
    public enum EnumTipoCalendarios
    {
        FechayHora,
        SoloFecha,
        SoloHora
    }

    /// <summary>
    /// Helper para generar un enlace estilo botón
    /// </summary>
    public static class CalendarHelper
    {
        public static MvcHtmlString TextBoxCalendar(this HtmlHelper htmlHelper, string id, string valor, EnumTipoCalendarios tipocalendario = EnumTipoCalendarios.SoloFecha,
            RouteValueDictionary htmlAttributes = null)
        {

            var sb = new StringBuilder();
            sb.AppendLine(@"    <div class=""input-group date datepicker"" id=""{0}"">
        {1}
        <span class=""input-group-addon add-on""><span class=""glyphicon glyphicon-calendar""></span></span>
        </div>");

            if (htmlAttributes == null)
            {
                htmlAttributes = new RouteValueDictionary { { "size", 16 }, { "class", "form-control" } };
            }
            else
            {
                if (!htmlAttributes.ContainsKey("size"))
                    htmlAttributes.Add("size", 16);

                if (!htmlAttributes.ContainsKey("class"))
                    htmlAttributes.Add("class", "form-control");
                else
                {
                    htmlAttributes["class"] = htmlAttributes["class"] + " form-control";
                }


            }

            MvcHtmlString html = htmlHelper.TextBox(id, valor, htmlAttributes);
            return new MvcHtmlString(String.Format(sb.ToString(), id, html));
                      
        }


        public static MvcHtmlString TextBoxCalendarFor<TModel, TValue>(this HtmlHelper<TModel> htmlHelper,
            Expression<Func<TModel, TValue>> expression, EnumTipoCalendarios tipocalendario = EnumTipoCalendarios.SoloFecha, 
            RouteValueDictionary htmlAttributes = null)
        {
            var sb = new StringBuilder();
            string clase = String.Empty;
            string formato = String.Empty;
            var result = String.Empty;
            bool sinValor = false;
            var styleClass = "form-control";
            

            if (htmlHelper.ViewData.Model != null)
            {
                Func<TModel, TValue> deleg = expression.Compile();
                result = deleg(htmlHelper.ViewData.Model).ToString();
            }
            else
            {
                result = DateTime.Now.ToShortDateString();
                sinValor = true;
            }

            string value = String.Empty;
            DateTime dateValue;

            if (result.ToString() != "")
            {
                CultureInfo culture = CultureInfo.CreateSpecificCulture("es-ES");
                var styles = DateTimeStyles.None;

                try
                {
                    dateValue = DateTime.Parse(result);

                    if (DateTime.TryParse(result, culture, styles, out dateValue))
                    {
                        value = "Ok";
                    }
                    else
                    {
                        value = "Error";
                    }
                }
                catch (Exception ex)
                {
                    value = ex.Message;
                }



                if (DateTime.TryParse(result, culture, styles, out dateValue))
                {
                    switch (tipocalendario)
                    {
                        case EnumTipoCalendarios.SoloFecha:
                            clase = "onlydatepicker";
                            formato = "dd/MM/yyyy";
                            break;

                        case EnumTipoCalendarios.FechayHora:
                            clase = "datetimepicker";
                            formato = "dd/MM/yyyy hh:mm:ss";
                            styleClass = "span2";
                            break;

                        case EnumTipoCalendarios.SoloHora:
                            clase = "onlytimepicker";
                            formato = "hh:mm:ss";

                            break;
                    }

                    if (sinValor)
                        value = "";
                    else
                        value = dateValue.ToString(formato);
                }
            }

            if (htmlAttributes == null)
            {
                htmlAttributes = new RouteValueDictionary { { "size", 16 }, { "data-format", formato }, { "Value", value }, { "class", styleClass } };
            }
            else
            {
                if (!htmlAttributes.ContainsKey("size"))
                    htmlAttributes.Add("size", 16);

                if (!htmlAttributes.ContainsKey("data-format"))
                    htmlAttributes.Add("data-format", formato);

                if (!htmlAttributes.ContainsKey("Value"))
                    htmlAttributes.Add("Value", value);

                if (!htmlAttributes.ContainsKey("class"))
                    htmlAttributes.Add("class", styleClass);
                else
                {
                    htmlAttributes["class"] = htmlAttributes["class"] + " ," + styleClass;
                }

                if (htmlAttributes.ContainsKey("data_bind"))
                {
                    htmlAttributes.Add("data-bind", htmlAttributes["data_bind"].ToString());
                    htmlAttributes.Remove("data_bind");
                }


            }

            sb.AppendLine(@"    <div id=""2"" class=""input-group date datepicker"">
                {0}
                <span class=""input-group-addon add-on""><span class=""glyphicon glyphicon-calendar""></span></span>
                </div>");


            MvcHtmlString html = htmlHelper.TextBoxFor(expression, htmlAttributes);

            return new MvcHtmlString(String.Format(sb.ToString(), html));
        }

    }
}