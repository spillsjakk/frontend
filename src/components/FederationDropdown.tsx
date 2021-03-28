import React, { ChangeEvent } from "react";
import Translated from "./translated";
export default function FederationDropdown(props: {
  className?: string;
  value?: string;
  name?: string;
  id?: string;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <select
      value={props.value}
      onChange={props.onChange}
      required={!!props.required}
      className={props.className}
      name={props.name}
      id={props.id}
    >
      <option value="" disabled>
        {Translated.byKey("pleaseSelect")}
      </option>
      <option value="AFG">Afghanistan</option>
      <option value="ALB">Albania</option>
      <option value="ALG">Algeria</option>
      <option value="AND">Andorra</option>
      <option value="ANG">Angola</option>
      <option value="ANT">Antigua and Barbuda</option>
      <option value="ARG">Argentina</option>
      <option value="ARM">Armenia</option>
      <option value="ARU">Aruba</option>
      <option value="AUS">Australia</option>
      <option value="AUT">Austria</option>
      <option value="AZE">Azerbaijan</option>
      <option value="BAH">Bahamas</option>
      <option value="BRN">Bahrain</option>
      <option value="BAN">Bangladesh</option>
      <option value="BAR">Barbados</option>
      <option value="BLR">Belarus</option>
      <option value="BEL">Belgium</option>
      <option value="BIZ">Belize</option>
      <option value="BER">Bermuda</option>
      <option value="BHU">Bhutan</option>
      <option value="BOL">Bolivia</option>
      <option value="BIH">Bosnia &amp; Herzegovina</option>
      <option value="BOT">Botswana</option>
      <option value="BRA">Brazil</option>
      <option value="IVB">British Virgin Islands</option>
      <option value="BRU">Brunei Darussalam</option>
      <option value="BUL">Bulgaria</option>
      <option value="BUR">Burkina Faso</option>
      <option value="BDI">Burundi</option>
      <option value="CAM">Cambodia</option>
      <option value="CMR">Cameroon</option>
      <option value="CAN">Canada</option>
      <option value="CPV">Cape Verde</option>
      <option value="CAY">Cayman Islands</option>
      <option value="CAF">Central African Republic</option>
      <option value="CHA">Chad</option>
      <option value="CHI">Chile</option>
      <option value="CHN">China</option>
      <option value="TPE">Chinese Taipei</option>
      <option value="COL">Colombia</option>
      <option value="COM">Comoros Islands</option>
      <option value="CGO">Congo</option>
      <option value="CRC">Costa Rica</option>
      <option value="CRO">Croatia</option>
      <option value="CUB">Cuba</option>
      <option value="CYP">Cyprus</option>
      <option value="CZE">Czech Republic</option>
      <option value="COD">Democratic Republic of Congo</option>
      <option value="DEN">Denmark</option>
      <option value="DJI">Djibouti</option>
      <option value="DOM">Dominican Republic</option>
      <option value="ECU">Ecuador</option>
      <option value="EGY">Egypt</option>
      <option value="ESA">El Salvador</option>
      <option value="ENG">England</option>
      <option value="GEQ">Equatorial Guinea</option>
      <option value="ERI">Eritrea</option>
      <option value="EST">Estonia</option>
      <option value="SWZ">Eswatini</option>
      <option value="ETH">Ethiopia</option>
      <option value="FAI">Faroe Islands</option>
      <option value="FIJ">Fiji</option>
      <option value="FIN">Finland</option>
      <option value="MKD">Former YUG Rep of Macedonia</option>
      <option value="FRA">France</option>
      <option value="GAB">Gabon</option>
      <option value="GAM">Gambia</option>
      <option value="GEO">Georgia</option>
      <option value="GER">Germany</option>
      <option value="GHA">Ghana</option>
      <option value="GRE">Greece</option>
      <option value="GRN">Grenada</option>
      <option value="GUM">Guam</option>
      <option value="GUA">Guatemala</option>
      <option value="GCI">Guernsey</option>
      <option value="GUY">Guyana</option>
      <option value="HAI">Haiti</option>
      <option value="HON">Honduras</option>
      <option value="HKG">Hong Kong</option>
      <option value="HUN">Hungary</option>
      <option value="ISL">Iceland</option>
      <option value="IND">India</option>
      <option value="INA">Indonesia</option>
      <option value="IRI">Iran</option>
      <option value="IRQ">Iraq</option>
      <option value="IRL">Ireland</option>
      <option value="ISR">Israel</option>
      <option value="ITA">Italy</option>
      <option value="CIV">Ivory Coast</option>
      <option value="JAM">Jamaica</option>
      <option value="JPN">Japan</option>
      <option value="JCI">Jersey</option>
      <option value="JOR">Jordan</option>
      <option value="KAZ">Kazakhstan</option>
      <option value="KEN">Kenya</option>
      <option value="KOS">Kosovo</option>
      <option value="KUW">Kuwait</option>
      <option value="KGZ">Kyrgyzstan</option>
      <option value="LAO">Laos</option>
      <option value="LAT">Latvia</option>
      <option value="LBN">Lebanon</option>
      <option value="LES">Lesotho</option>
      <option value="LBR">Liberia</option>
      <option value="LBA">Libya</option>
      <option value="LIE">Liechtenstein</option>
      <option value="LTU">Lithuania</option>
      <option value="LUX">Luxembourg</option>
      <option value="MAC">Macau</option>
      <option value="MAD">Madagascar</option>
      <option value="MAW">Malawi</option>
      <option value="MAS">Malaysia</option>
      <option value="MDV">Maldives</option>
      <option value="MLI">Mali</option>
      <option value="MLT">Malta</option>
      <option value="MTN">Mauritania</option>
      <option value="MRI">Mauritius</option>
      <option value="MEX">Mexico</option>
      <option value="MDA">Moldova</option>
      <option value="MNC">Monaco</option>
      <option value="MGL">Mongolia</option>
      <option value="MNE">Montenegro</option>
      <option value="MAR">Morocco</option>
      <option value="MOZ">Mozambique</option>
      <option value="MYA">Myanmar</option>
      <option value="NAM">Namibia</option>
      <option value="NRU">Nauru</option>
      <option value="NEP">Nepal</option>
      <option value="NED">Netherlands</option>
      <option value="AHO">Netherlands Antilles</option>
      <option value="NZL">New Zealand</option>
      <option value="NCA">Nicaragua</option>
      <option value="NGR">Nigeria</option>
      <option value="NOR">Norway</option>
      <option value="OMA">Oman</option>
      <option value="PAK">Pakistan</option>
      <option value="PLW">Palau</option>
      <option value="PLE">Palestine</option>
      <option value="PAN">Panama</option>
      <option value="PNG">Papua New Guinea</option>
      <option value="PAR">Paraguay</option>
      <option value="PER">Peru</option>
      <option value="PHI">Philippines</option>
      <option value="POL">Poland</option>
      <option value="POR">Portugal</option>
      <option value="PUR">Puerto Rico</option>
      <option value="QAT">Qatar</option>
      <option value="ROU">Romania</option>
      <option value="RUS">Russia</option>
      <option value="RWA">Rwanda</option>
      <option value="SKN">Saint Kitts and Nevis</option>
      <option value="LCA">Saint Lucia</option>
      <option value="SMR">San Marino</option>
      <option value="STP">Sao Tome and Principe</option>
      <option value="KSA">Saudi Arabia</option>
      <option value="SCO">Scotland</option>
      <option value="SEN">Senegal</option>
      <option value="SRB">Serbia</option>
      <option value="SEY">Seychelles</option>
      <option value="SLE">Sierra Leone</option>
      <option value="SGP">Singapore</option>
      <option value="SVK">Slovakia</option>
      <option value="SLO">Slovenia</option>
      <option value="SOL">Solomon Islands</option>
      <option value="SOM">Somalia</option>
      <option value="RSA">South Africa</option>
      <option value="KOR">South Korea</option>
      <option value="SSD">South Sudan</option>
      <option value="ESP">Spain</option>
      <option value="SRI">Sri Lanka</option>
      <option value="SUD">Sudan</option>
      <option value="SUR">Suriname</option>
      <option value="SWE">Sweden</option>
      <option value="SUI">Switzerland</option>
      <option value="SYR">Syria</option>
      <option value="TJK">Tajikistan</option>
      <option value="TAN">Tanzania</option>
      <option value="THA">Thailand</option>
      <option value="TLS">Timor-Leste</option>
      <option value="TOG">Togo</option>
      <option value="TTO">Trinidad &amp; Tobago</option>
      <option value="TUN">Tunisia</option>
      <option value="TUR">Turkey</option>
      <option value="TKM">Turkmenistan</option>
      <option value="UGA">Uganda</option>
      <option value="UKR">Ukraine</option>
      <option value="UAE">United Arab Emirates</option>
      <option value="USA">United States of America</option>
      <option value="URU">Uruguay</option>
      <option value="ISV">US Virgin Islands</option>
      <option value="UZB">Uzbekistan</option>
      <option value="VEN">Venezuela</option>
      <option value="VIE">Vietnam</option>
      <option value="WLS">Wales</option>
      <option value="YEM">Yemen</option>
      <option value="ZAM">Zambia</option>
      <option value="ZIM">Zimbabwe</option>
    </select>
  );
}
