import LanguageSelector from "./LanguageSelector";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function Header(){

const { t } = useContext(LanguageContext);

return(

<div className="header">

<div className="headerLeft">

<div className="logoCircle">

SSU

</div>

<div>

<h1 className="title">

{t.title}

</h1>

<div className="subtitle">

{t.portal}

</div>

</div>

</div>


<div className="headerRight">

<LanguageSelector/>

</div>

</div>

);

}
