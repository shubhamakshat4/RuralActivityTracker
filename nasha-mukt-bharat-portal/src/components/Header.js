import LanguageSelector from "./LanguageSelector";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function Header({
  title,
  subtitle
}) {

const { t } = useContext(LanguageContext);

return (

<div className="header">

<div className="headerLeft">

<div className="logoCircle">
SSU
</div>

<div>

<h1 className="title">
{title || t.title}
</h1>

<div className="subtitle">
{subtitle || t.portal}
</div>

</div>

</div>

<div className="headerRight">
<LanguageSelector/>
</div>

</div>

);
}