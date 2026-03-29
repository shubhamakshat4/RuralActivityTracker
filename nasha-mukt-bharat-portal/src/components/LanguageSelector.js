import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function LanguageSelector(){

const { lang,setLang } = useContext(LanguageContext);

return(

<div className="langBox">

🌐

<select

value={lang}

onChange={(e)=>setLang(e.target.value)}

className="langSelect"

>

<option value="en">English</option>

<option value="hi">हिन्दी</option>

<option value="od">ଓଡ଼ିଆ</option>

</select>

</div>

);

}
