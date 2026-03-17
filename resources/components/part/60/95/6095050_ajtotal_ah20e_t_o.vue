<template>
  <v-container fluid class="pt-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <div class="d-flex justify-end">
              <!-- Copy -->
              <BaseButton
                icon_type="sync"
                :btn_text="$t('copy')"
                @onclick="onCopy()"
              />

              <!-- Confirm -->
              <BaseButton
                icon_type="confirm"
                :btn_text="$t('confirm')"
                @onclick="onConfirmM()"
              />
              <!-- Report -->
              <BaseButton
                icon_type="print"
                :btn_text="$t('report_excel')"
                @onclick="exportReport('EXCEL')"
              />
              <BaseButton
                icon_type="print"
                :btn_text="$t('report_pdf')"
                @onclick="exportReport('PDF')"
              />
            </div>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <div
          id="e-invoice-template"
          align="center"
          x:publishsource="Excel"
        >
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="740"
            style="
              border-collapse: collapse;
              table-layout: fixed;
              width: 496.8pt;
            "
          >
            <col
              class="xl6518230"
              width="6"
              style="
                mso-width-source: userset;
                mso-width-alt: 199;
                width: 3.6pt;
              "
            />
            <col
              class="xl6518230"
              width="33"
              style="
                mso-width-source: userset;
                mso-width-alt: 1166;
                width: 22.5pt;
              "
            />
            <col
              class="xl6518230"
              width="70"
              style="
                mso-width-source: userset;
                mso-width-alt: 2474;
                width: 46.8pt;
              "
            />
            <col
              class="xl6518230"
              width="55"
              style="
                mso-width-source: userset;
                mso-width-alt: 1962;
                width: 36.9pt;
              "
            />
            <col
              class="xl6518230"
              width="41"
              style="
                mso-width-source: userset;
                mso-width-alt: 1450;
                width: 27.9pt;
              "
            />
            <col
              class="xl6518230"
              width="34"
              style="
                mso-width-source: userset;
                mso-width-alt: 1194;
                width: 22.5pt;
              "
            />
            <col
              class="xl6518230"
              width="62"
              style="
                mso-width-source: userset;
                mso-width-alt: 2218;
                width: 42.3pt;
              "
            />
            <col
              class="xl6518230"
              width="27"
              style="mso-width-source: userset; mso-width-alt: 967; width: 18pt"
            />
            <col
              class="xl6518230"
              width="78"
              style="
                mso-width-source: userset;
                mso-width-alt: 2759;
                width: 52.2pt;
              "
            />
            <col
              class="xl6518230"
              width="56"
              style="
                mso-width-source: userset;
                mso-width-alt: 1991;
                width: 37.8pt;
              "
            />
            <col
              class="xl6518230"
              width="30"
              style="
                mso-width-source: userset;
                mso-width-alt: 1080;
                width: 20.7pt;
              "
            />
            <col
              class="xl6518230"
              width="6"
              style="
                mso-width-source: userset;
                mso-width-alt: 199;
                width: 3.6pt;
              "
            />
            <col
              class="xl6518230"
              width="49"
              style="
                mso-width-source: userset;
                mso-width-alt: 1735;
                width: 33.3pt;
              "
            />
            <col
              class="xl6518230"
              width="48"
              style="
                mso-width-source: userset;
                mso-width-alt: 1706;
                width: 32.4pt;
              "
            />
            <col
              class="xl6518230"
              width="6"
              style="
                mso-width-source: userset;
                mso-width-alt: 199;
                width: 3.6pt;
              "
            />
            <col
              class="xl6518230"
              width="55"
              style="
                mso-width-source: userset;
                mso-width-alt: 1962;
                width: 36.9pt;
              "
            />
            <col
              class="xl6518230"
              width="78"
              style="
                mso-width-source: userset;
                mso-width-alt: 2759;
                width: 52.2pt;
              "
            />
            <col
              class="xl6518230"
              width="6"
              style="
                mso-width-source: userset;
                mso-width-alt: 199;
                width: 3.6pt;
              "
            />
            <tr height="33" style="mso-height-source: userset; height: 22.5pt">
              <td
                height="33"
                width="6"
                style="height: 22.5pt; width: 3.6pt"
                align="left"
                valign="top"
              >
                <span
                  style="
                    mso-ignore: vglayout;
                    position: absolute;
                    z-index: 3;
                    margin-left: 4px;
                    margin-top: 27px;
                    width: 167px;
                    height: 25px;
                  "
                  ><img
                    width="167"
                    height="25"
                    :src="imageLogo"
                    v:shapes="Picture_x0020_6" /></span
                ><span style="mso-ignore: vglayout2">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td
                        height="33"
                        class="xl10518230"
                        width="6"
                        style="height: 22.5pt; width: 3.6pt"
                      >
                        &nbsp;
                      </td>
                    </tr>
                  </table>
                </span>
              </td>
              <td class="xl6718230" width="33" style="width: 22.5pt">&nbsp;</td>
              <td class="xl9518230" width="70" style="width: 46.8pt">&nbsp;</td>
              <td class="xl9518230" width="55" style="width: 36.9pt">&nbsp;</td>
              <td
                colspan="9"
                class="xl20618230"
                width="383"
                style="width: 287pt"
              >
                HÓA &#272;&#416;N GIÁ TR&#7882; GIA T&#258;NG
              </td>
              <td class="xl9518230" width="48" style="width: 32.4pt">&nbsp;</td>
              <td class="xl9518230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl9518230" width="55" style="width: 36.9pt">&nbsp;</td>
              <td class="xl9518230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td class="xl9618230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="20" style="mso-height-source: userset; height: 13.5pt">
              <td height="20" class="xl11718230" style="height: 13.5pt">
                &nbsp;
              </td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td colspan="9" class="xl20718230">(VAT INVOICE)</td>
              <td
                class="xl6918230"
                colspan="5"
                style="border-right: 0.5pt solid black"
              >
                M&#7851;u s&#7889; (<font class="font1218230">Form</font
                ><font class="font918230">): </font
                ><font class="font818230">{{ mstData.FORM_NO }}</font>
              </td>
            </tr>
            <tr height="20" style="mso-height-source: userset; height: 13.5pt">
              <td height="20" class="xl11718230" style="height: 13.5pt">
                &nbsp;
              </td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td colspan="9" class="xl8318230">
              </td>
              <td class="xl6918230" colspan="4">
                Ký hi&#7879;u (<font class="font1218230">Serial</font
                ><font class="font918230">):</font
                ><font class="font818230"> {{ mstData.SERIAL_NO }}</font>
              </td>
              <td class="xl7018230">&nbsp;</td>
            </tr>
            <tr height="22" style="mso-height-source: userset; height: 15.2pt">
              <td height="22" class="xl11718230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td
                colspan="9"
                class="xl20818230"
                width="383"
                style="width: 287pt"
              >
                Ngày <font class="font1218230">(Date)</font
                ><font class="font1118230"
                  ><span style="mso-spacerun: yes">   </span></font
                ><font class="font718230"
                  ><span style="mso-spacerun: yes"> </span>tháng </font
                ><font class="font1218230">(month)</font
                ><font class="font718230"
                  ><span style="mso-spacerun: yes">    </span>n&#259;m </font
                ><font class="font1218230">(year)</font
                ><font class="font718230"
                  ><span style="mso-spacerun: yes">    </span></font
                >
              </td>
              <td class="xl6918230" colspan="4">
                S&#7889; (<font class="font1218230">No</font
                ><font class="font918230">.):</font
                ><font class="font818230"
                  ><span style="mso-spacerun: yes">      </span></font
                ><font class="font1918230"
                  ><span style="mso-spacerun: yes"> </span></font
                ><font class="font2118230">0000000</font>
              </td>
              <td class="xl7218230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="4" style="mso-height-source: userset; height: 3pt">
              <td
                colspan="2"
                height="4"
                class="xl117182301"
                style="height: 3pt"
              >
                &nbsp;
              </td>
              <td
                class="xl65182301"
                colspan="16"
                style="height: 3pt; border-right: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
            </tr>
            <tr height="4" style="mso-height-source: userset; height: 3pt">
              <td height="4" class="xl66182301" style="height: 3pt">&nbsp;</td>
              <td class="xl67182301" colspan="16">&nbsp;</td>
              <td class="xl68182301">&nbsp;</td>
            </tr>
            <tr height="22" style="height: 15.2pt">
              <td height="22" class="xl11718230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl7518230" colspan="14">
                &#272;&#417;n v&#7883; bán hàng (<font class="font1218230"
                  >Company name</font
                ><font class="font718230">): </font
                ><font class="font2218230">{{ mstData.COMPANY_NM }}</font>
              </td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl7018230">&nbsp;</td>
            </tr>
            <tr height="23" style="height: 15.2pt">
              <td height="23" class="xl11718230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl7518230" colspan="6">
                Mã s&#7889; thu&#7871; (<font class="font1218230">Tax code</font
                ><font class="font718230">):</font
                ><font class="font1318230"> </font
                ><font class="font2018230">{{ mstData.TAX_CODE_DISPLAY }}</font>
              </td>
              <td class="xl7618230">&nbsp;</td>
              <td class="xl7518230">&nbsp;</td>
              <td class="xl7518230">&nbsp;</td>
              <td class="xl7518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl7018230">&nbsp;</td>
            </tr>
            <tr
              class="xl6918230"
              height="24"
              style="mso-height-source: userset; height: 15.2pt"
            >
              <td height="24" class="xl8818230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl6918230" colspan="16">
                &#272;&#7883;a ch&#7881; (<font class="font1118230"
                  >Address</font
                ><font class="font918230">): {{ mstData.ADDR }}</font>
              </td>
              <td class="xl15818230">&nbsp;</td>
            </tr>
            <tr class="xl6918230" height="18" style="height: 15.2pt">
              <td height="18" class="xl8818230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl6918230" colspan="9">
                &#272;i&#7879;n tho&#7841;i (<font class="font1118230">Tel</font
                ><font class="font918230"
                  >): {{ mstData.TEL }}
                  <span style="mso-spacerun: yes">         </span>Fax:
                  {{ mstData.FAX }}</font
                >
              </td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl15818230">&nbsp;</td>
            </tr>
            <tr
              class="xl6918230"
              height="17"
              style="mso-height-source: userset; height: 15.2pt"
            >
              <td height="17" class="xl8818230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl6918230" colspan="9">
                S&#7889; tài kho&#7843;n (<font class="font1218230"
                  >Account No</font
                ><font class="font1118230">.</font
                ><font class="font918230"
                  >):<span style="mso-spacerun: yes">  </span></font
                ><font class="font818230">{{ mstData.BANK_ACCOUNT1 }}</font>
              </td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl15818230">&nbsp;</td>
            </tr>
            <tr
              class="xl6918230"
              height="17"
              style="mso-height-source: userset; height: 15.2pt"
            >
              <td height="17" class="xl8818230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl6918230" colspan="12">
                Ngân hàng (<font class="font1218230">Bank name</font
                ><font class="font918230">): </font
                ><font class="font818230">{{ mstData.BANK_NM1 }}</font
                ><font class="font918230"
                  >.<span style="mso-spacerun: yes">   </span>Swift code: </font
                ><font class="font818230"> {{ mstData.BANK_NM2 }}</font>
              </td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl15818230">&nbsp;</td>
            </tr>
            <tr height="4" style="mso-height-source: userset; height: 3pt">
              <td
                colspan="2"
                height="4"
                class="xl117182301"
                style="height: 3pt"
              >
                &nbsp;
              </td>
              <td
                class="xl65182301"
                colspan="16"
                style="height: 3pt; border-right: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
            </tr>
            <tr height="4" style="mso-height-source: userset; height: 3pt">
              <td height="4" class="xl66182301" style="height: 3pt">&nbsp;</td>
              <td class="xl67182301" colspan="16">&nbsp;</td>
              <td class="xl68182301">&nbsp;</td>
            </tr>
            <tr height="24" style="mso-height-source: userset; height: 15.2pt">
              <td height="24" class="xl11718230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl7518230" colspan="6">
                H&#7885; tên ng&#432;&#7901;i mua hàng (<font
                  class="font1218230"
                  >Customer's name</font
                ><font class="font718230">):</font>
              </td>
              <td
                colspan="11"
                class="xl21118230"
                style="border-right: 0.5pt solid black"
              >
                &nbsp;
              </td>
            </tr>
            <tr height="24" style="mso-height-source: userset; height: 15.2pt">
              <td height="24" class="xl11718230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl7518230" colspan="4">
                Tên &#273;&#417;n v&#7883; (<font class="font1218230"
                  >Company's name</font
                ><font class="font718230">):</font>
              </td>
              <td class="xl7818230">&nbsp;</td>
              <td colspan="11" class="xl20118230">&nbsp;</td>
              <td class="xl11818230">&nbsp;</td>
            </tr>
            <tr height="21" style="height: 12.6pt">
              <td height="21" class="xl11718230" style="height: 12.6pt">
                &nbsp;
              </td>
              <td class="xl7518230" colspan="3">
                Mã s&#7889; thu&#7871; (<font class="font1218230">Tax code</font
                ><font class="font718230"
                  >):<span style="mso-spacerun: yes"> </span></font
                >
              </td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl10618230">&nbsp;</td>
              <td class="xl11818230">&nbsp;</td>
            </tr>
            <tr height="24" style="mso-height-source: userset; height: 15.2pt">
              <td height="24" class="xl11718230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl7518230" colspan="3">
                &#272;&#7883;a ch&#7881; (<font class="font1218230"
                  >Address</font
                ><font class="font718230"
                  >):<span style="mso-spacerun: yes"> </span></font
                >
              </td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7818230">&nbsp;</td>
              <td class="xl7918230">&nbsp;</td>
            </tr>
            <tr height="22" style="height: 15.2pt">
              <td height="22" class="xl11718230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl7518230" colspan="7">
                Hình th&#7913;c thanh toán (<font class="font1218230"
                  >Mod of payment</font
                ><font class="font718230">): </font
                ><font class="font518230"></font>
              </td>
              <td class="xl7518230">&nbsp;</td>
              <td class="xl6518230" colspan="7">
                <font class="font718230">Th&#7901;i h&#7841;n thanh toán </font
                ><font class="font1118230">(</font
                ><font class="font1218230">Payment term</font
                ><font class="font718230">):</font>
              </td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl7018230">&nbsp;</td>
            </tr>
            <tr class="xl6918230" height="18" style="height: 15.2pt">
              <td height="18" class="xl8818230" style="height: 15.2pt">
                &nbsp;
              </td>
              <td class="xl6918230" colspan="2">S&#7889; H&#272;:</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230" colspan="2">Ngày H&#272;:</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230" colspan="2">
                K&#7923; (<font class="font1218230">Period</font
                ><font class="font918230">):</font>
              </td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl6918230">&nbsp;</td>
              <td class="xl15818230">&nbsp;</td>
            </tr>
            <tr height="4" style="mso-height-source: userset; height: 3pt">
              <td
                colspan="2"
                height="4"
                class="xl117182301"
                style="height: 3pt"
              >
                &nbsp;
              </td>
              <td
                class="xl65182301"
                colspan="16"
                style="height: 3pt; border-right: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
            </tr>

            <tr class="xl8218230" height="21" style="height: 12.6pt">
              <td
                colspan="2"
                height="21"
                class="xl20218230"
                style="height: 12.6pt"
              >
                STT
              </td>
              <td colspan="6" class="xl14618230">
                Tên hàng hóa, d&#7883;ch v&#7909;
              </td>
              <td class="xl14618230">&#272;&#417;n v&#7883; tính</td>
              <td
                colspan="3"
                class="xl14618230"
                style="border-right: 0.5pt dotted black"
              >
                S&#7889; l&#432;&#7907;ng
              </td>
              <td
                colspan="3"
                class="xl20318230"
                style="border-right: 0.5pt dotted black"
              >
                &#272;&#417;n giá
              </td>
              <td
                colspan="3"
                class="xl20318230"
                style="border-right: 0.5pt solid black"
              >
                Thành ti&#7873;n
              </td>
            </tr>
            <tr class="xl8318230" height="18" style="height: 11.88pt">
              <td
                colspan="2"
                height="18"
                class="xl19418230"
                style="height: 11.88pt"
              >
                No.
              </td>
              <td colspan="6" class="xl14718230">Description of goods</td>
              <td class="xl14718230">Unit</td>
              <td
                colspan="3"
                class="xl14718230"
                style="border-right: 0.5pt dotted black"
              >
                Quatity
              </td>
              <td
                colspan="3"
                class="xl8318230"
                style="border-right: 0.5pt dotted black"
              >
                Unit price
              </td>
              <td
                colspan="3"
                class="xl8318230"
                style="border-right: 0.5pt solid black"
              >
                Amount
              </td>
            </tr>
            <tr
              class="xl8418230"
              height="20"
              style="mso-height-source: userset; height: 13.5pt"
            >
              <td
                colspan="2"
                height="20"
                class="xl19718230"
                style="height: 13.5pt"
              >
                1
              </td>
              <td colspan="6" class="xl14818230">2</td>
              <td class="xl14818230">3</td>
              <td
                colspan="3"
                class="xl14818230"
                style="border-right: 0.5pt dotted black"
              >
                4
              </td>
              <td
                colspan="3"
                class="xl19818230"
                style="border-right: 0.5pt dotted black"
              >
                5
              </td>
              <td
                colspan="3"
                class="xl19818230"
                style="border-right: 0.5pt solid black"
              >
                6 = 4 x 5
              </td>
            </tr>
            <tr
              class="xl8218230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                class="xl18518230"
                height="25"
                width="39"
                style="height: 15.05pt; width: 29pt"
                align="left"
                valign="top"
              >
                <span
                  style="
                    mso-ignore: vglayout;
                    position: absolute;
                    z-index: 2;
                    margin-left: 4px;
                    margin-top: 40px;
                    width: 630px;
                    height: 150px;
                  "
                  ><img
                    width="630"
                    height="150"
                    :src="imageBackGroup"
                    v:shapes="Picture_x0020_4" /></span
                ><span style="mso-ignore: vglayout2">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td
                        colspan="2"
                        height="25"
                        width="39"
                        style="height: 15.05pt; width: 29pt"
                      >
                        &nbsp;
                      </td>
                    </tr>
                  </table>
                </span>
              </td>
              <td
                colspan="6"
                class="xl18718230"
                width="289"
                style="width: 216pt"
              >
                M&#7850;U
              </td>
              <td class="xl15218230">&nbsp;</td>
              <td colspan="2" class="xl18918230">&nbsp;</td>
              <td class="xl14918230">&nbsp;</td>
              <td colspan="2" class="xl19018230">&nbsp;</td>
              <td class="xl14118230">&nbsp;</td>
              <td
                colspan="2"
                class="xl19118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl13118230">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl19218230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15318230" style="border-top: none">&nbsp;</td>
              <td class="xl15618230" style="border-top: none">&nbsp;</td>
              <td class="xl11618230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14218230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl11018230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15318230" style="border-top: none">&nbsp;</td>
              <td class="xl15618230" style="border-top: none">&nbsp;</td>
              <td class="xl11618230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14218230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl11018230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td class="xl15618230" style="border-top: none">&nbsp;</td>
              <td class="xl11618230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14218230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl11018230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td class="xl15618230" style="border-top: none">&nbsp;</td>
              <td class="xl11618230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14218230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl11018230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td class="xl15618230" style="border-top: none">&nbsp;</td>
              <td class="xl11618230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14218230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl11018230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td class="xl15618230" style="border-top: none">&nbsp;</td>
              <td class="xl11618230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14218230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl11018230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td class="xl15618230" style="border-top: none">&nbsp;</td>
              <td class="xl11618230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14218230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl11018230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td class="xl15618230" style="border-top: none">&nbsp;</td>
              <td class="xl11618230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14218230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl11018230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td class="xl11218230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14318230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl10918230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td class="xl15618230" style="border-top: none">&nbsp;</td>
              <td class="xl11618230" style="border-top: none">&nbsp;</td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230">&nbsp;</td>
              <td class="xl14218230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl11018230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl11118230"
              height="25"
              style="mso-height-source: userset; height: 15.05pt"
            >
              <td
                colspan="2"
                height="25"
                class="xl18018230"
                width="39"
                style="height: 15.05pt; border-bottom: none; width: 29pt"
              >
                &nbsp;
              </td>
              <td
                colspan="6"
                class="xl12818230"
                width="289"
                style="width: 216pt"
              >
                &nbsp;
              </td>
              <td class="xl15418230" style="border-top: none">&nbsp;</td>
              <td
                class="xl15418230"
                colspan="2"
                style="border-top: none; border-bottom: none"
              >
                &nbsp;
              </td>
              <td class="xl15018230" style="border-top: none">&nbsp;</td>
              <td colspan="2" class="xl11618230" style="border-bottom: none">
                &nbsp;
              </td>
              <td class="xl14318230" style="border-top: none">&nbsp;</td>
              <td
                colspan="2"
                class="xl18118230"
                width="133"
                style="width: 99pt"
              >
                &nbsp;
              </td>
              <td class="xl10918230" style="border-top: none">&nbsp;</td>
            </tr>
            <tr
              class="xl7518230"
              height="26"
              style="mso-height-source: userset; height: 15.2pt"
            >
              <td
                height="26"
                class="xl13518230"
                width="6"
                style="height: 15.2pt; width: 3.6pt"
              >
                &nbsp;
              </td>
              <td
                class="xl13218230"
                colspan="7"
                width="33"
                style="width: 22.5pt; border-top: none"
              >
                &nbsp;
              </td>
              <td
                colspan="7"
                class="xl17418230"
                width="273"
                style="width: 204pt; border-top: none"
              >
                C&#7897;ng ti&#7873;n hàng (<font class="font1218230"
                  >Total amount</font
                ><font class="font918230">) :</font>
              </td>
              <td colspan="2" class="xl17518230">&nbsp;</td>
              <td class="xl13418230">&nbsp;</td>
            </tr>
            <tr
              class="xl7518230"
              height="26"
              style="mso-height-source: userset; height: 15.2pt"
            >
              <td
                height="26"
                class="xl13618230"
                width="6"
                style="height: 15.2pt; width: 3.6pt"
              >
                &nbsp;
              </td>
              <td
                colspan="7"
                class="xl13818230"
                width="199"
                style="width: 149pt"
              >
                <span style="mso-spacerun: yes"> </span>Thu&#7871; su&#7845;t
                GTGT (<font class="font1218230">VAT rate</font
                ><font class="font918230">) :</font>
              </td>
              <td
                colspan="7"
                class="xl17718230"
                width="273"
                style="width: 204pt"
              >
                Ti&#7873;n thu&#7871; GTGT (<font class="font1218230">VAT</font
                ><font class="font918230">) :</font>
              </td>
              <td colspan="2" class="xl17818230">&nbsp;</td>
              <td class="xl13318230">&nbsp;</td>
            </tr>
            <tr
              class="xl7518230"
              height="26"
              style="mso-height-source: userset; height: 15.2pt"
            >
              <td
                height="26"
                class="xl13518230"
                width="6"
                style="
                  height: 15.2pt;
                  width: 3.6pt;
                  border-bottom: 0.5pt solid windowtext;
                "
              >
                &nbsp;
              </td>
              <td
                class="xl13218230"
                colspan="7"
                width="33"
                style="width: 22.5pt; border-bottom: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
              <td
                colspan="7"
                class="xl17418230"
                width="273"
                style="width: 204pt; border-bottom: 0.5pt solid windowtext"
              >
                T&#7893;ng ti&#7873;n thanh toán (<font class="font1218230"
                  >Total payment</font
                ><font class="font918230">) :</font>
              </td>
              <td
                colspan="2"
                class="xl17518230"
                style="border-bottom: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
              <td
                class="xl13418230"
                style="border-bottom: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
            </tr>
            <tr
              class="xl7518230"
              height="24"
              style="mso-height-source: userset; height: 14.6pt"
            >
              <td height="24" class="xl13918230" style="height: 14.6pt">
                &nbsp;
              </td>
              <td colspan="16" class="xl17018230">
                S&#7889; ti&#7873;n vi&#7871;t b&#7857;ng ch&#7919; (<font
                  class="font1218230"
                  >In words</font
                ><font class="font718230">): ./.</font>
              </td>
              <td class="xl12018230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="6" style="mso-height-source: userset; height: 4.95pt">
              <td height="6" class="xl8118230" style="height: 4.95pt">
                &nbsp;
              </td>
              <td class="xl8518230">&nbsp;</td>
              <td class="xl8518230">&nbsp;</td>
              <td class="xl8518230">&nbsp;</td>
              <td class="xl8618230" width="41" style="width: 27.9pt">&nbsp;</td>
              <td class="xl8618230" width="34" style="width: 22.5pt">&nbsp;</td>
              <td class="xl8618230" width="62" style="width: 42.3pt">&nbsp;</td>
              <td class="xl8618230" width="27" style="width: 18pt">&nbsp;</td>
              <td class="xl8618230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td class="xl8618230" width="56" style="width: 37.8pt">&nbsp;</td>
              <td class="xl8618230" width="30" style="width: 20.7pt">&nbsp;</td>
              <td class="xl8618230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl8618230" width="49" style="width: 33.3pt">&nbsp;</td>
              <td class="xl8618230" width="48" style="width: 32.4pt">&nbsp;</td>
              <td class="xl8618230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl8618230" width="55" style="width: 36.9pt">&nbsp;</td>
              <td class="xl8618230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td class="xl8718230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="18" style="height: 11.5pt">
              <td height="18" class="xl11718230" style="height: 11.5pt">
                &nbsp;
              </td>
              <td class="xl6718230" colspan="9">
                Quý khách vui lòng ghi s&#7889; hóa &#273;&#417;n c&#7847;n
                thanh toán khi th&#7921;c hi&#7879;n chuy&#7875;n kho&#7843;n.
              </td>
              <td
                class="xl12618230"
                width="30"
                style="border-top: none; width: 20.7pt"
              >
                &nbsp;
              </td>
              <td
                class="xl12618230"
                width="6"
                style="border-top: none; width: 3.6pt"
              >
                &nbsp;
              </td>
              <td
                class="xl12618230"
                width="49"
                style="border-top: none; width: 33.3pt"
              >
                &nbsp;
              </td>
              <td
                class="xl12618230"
                width="48"
                style="border-top: none; width: 32.4pt"
              >
                &nbsp;
              </td>
              <td
                class="xl12618230"
                width="6"
                style="border-top: none; width: 3.6pt"
              >
                &nbsp;
              </td>
              <td
                class="xl12618230"
                width="55"
                style="border-top: none; width: 36.9pt"
              >
                &nbsp;
              </td>
              <td
                class="xl12618230"
                width="78"
                style="border-top: none; width: 52.2pt"
              >
                &nbsp;
              </td>
              <td class="xl12318230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="18" style="height: 11.5pt">
              <td height="18" class="xl11718230" style="height: 11.5pt">
                &nbsp;
              </td>
              <td class="xl6518230" colspan="8">
                (<font class="font1218230"
                  >Please kidly write the invoice number(s) on the lelegraphic
                  transfer</font
                ><font class="font1018230">)</font>
              </td>
              <td class="xl10818230" width="56" style="width: 37.8pt">
                &nbsp;
              </td>
              <td class="xl10818230" width="30" style="width: 20.7pt">
                &nbsp;
              </td>
              <td class="xl10818230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl10818230" width="49" style="width: 33.3pt">
                &nbsp;
              </td>
              <td class="xl10818230" width="48" style="width: 32.4pt">
                &nbsp;
              </td>
              <td class="xl10818230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl10818230" width="55" style="width: 36.9pt">
                &nbsp;
              </td>
              <td class="xl10818230" width="78" style="width: 52.2pt">
                &nbsp;
              </td>
              <td class="xl12318230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr
              class="xl12118230"
              height="24"
              style="mso-height-source: userset; height: 14.6pt"
            >
              <td height="24" class="xl11918230" style="height: 14.6pt">
                &nbsp;
              </td>
              <td
                colspan="4"
                class="xl12418230"
                width="199"
                style="width: 149pt"
              >
                Ng&#432;&#7901;i chuy&#7875;n &#273;&#7893;i (Converter)
              </td>
              <td class="xl12418230" width="34" style="width: 22.5pt">
                &nbsp;
              </td>
              <td
                colspan="3"
                class="xl12418230"
                width="167"
                style="width: 122.5pt"
              >
                Ng&#432;&#7901;i mua hàng (Buyer)
              </td>
              <td
                colspan="8"
                class="xl12418230"
                width="328"
                style="width: 245pt"
              >
                Ng&#432;&#7901;i bán hàng (Seller)
              </td>
              <td class="xl12018230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr
              class="xl9118230"
              height="15"
              style="mso-height-source: userset; height: 11.55pt"
            >
              <td height="15" class="xl8918230" style="height: 11.55pt">
                &nbsp;
              </td>
              <td
                colspan="4"
                class="xl12718230"
                width="199"
                style="width: 149pt"
              >
                (Ký, ghi rõ h&#7885; tên)
              </td>
              <td class="xl12718230" width="34" style="width: 22.5pt">
                &nbsp;
              </td>
              <td
                colspan="3"
                class="xl12718230"
                width="167"
                style="width: 125pt"
              >
                (Ký, ghi rõ h&#7885; tên)
              </td>
              <td
                colspan="8"
                class="xl12718230"
                width="328"
                style="width: 245pt"
              >
                (Ký, &#273;óng d&#7845;u, ghi rõ h&#7885; tên)
              </td>
              <td class="xl12218230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="21" style="height: 12.6pt">
              <td height="21" class="xl11718230" style="height: 12.6pt">
                &nbsp;
              </td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl7118230" width="41" style="width: 27.9pt">&nbsp;</td>
              <td class="xl7118230" width="34" style="width: 25pt">&nbsp;</td>
              <td class="xl7118230" width="62" style="width: 42.3pt">&nbsp;</td>
              <td class="xl7118230" width="27" style="width: 18pt">&nbsp;</td>
              <td class="xl7118230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td class="xl7118230" width="56" style="width: 37.8pt">&nbsp;</td>
              <td class="xl7118230" width="30" style="width: 20.7pt">&nbsp;</td>
              <td class="xl7118230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td
                class="xl7118230"
                width="49"
                style="width: 33.3pt"
                colspan="2"
              >
                &nbsp;
              </td>
              <td class="xl7118230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl7118230" width="55" style="width: 36.9pt">&nbsp;</td>
              <td class="xl7118230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td class="xl9218230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="17" style="mso-height-source: userset; height: 11.75pt">
              <td height="17" class="xl11718230" style="height: 11.75pt">
                &nbsp;
              </td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl6518230">&nbsp;</td>
              <td class="xl7118230" width="41" style="width: 27.9pt">&nbsp;</td>
              <td class="xl7118230" width="34" style="width: 25pt">&nbsp;</td>
              <td class="xl7118230" width="62" style="width: 42.3pt">&nbsp;</td>
              <td class="xl7118230" width="27" style="width: 18pt">&nbsp;</td>
              <td class="xl7118230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td
                class="xl16018230"
                colspan="4"
                style="
                  border-top: 0.5pt solid windowtext;
                  border-left: 0.5pt solid windowtext;
                "
              >
                Signature Valid
              </td>
              <td
                align="left"
                valign="top"
                style="border-top: 0.5pt solid windowtext"
              >
                <span
                  style="
                    mso-ignore: vglayout;
                    position: absolute;
                    z-index: 1;
                    margin-left: 6px;
                    margin-top: 6px;
                    width: 58px;
                    height: 38px;
                  "
                  ><img
                    width="58"
                    height="38"
                    :src="imageSign"
                    v:shapes="Picture_x0020_8" /></span
                ><span style="mso-ignore: vglayout2">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td
                        height="17"
                        width="48"
                        style="height: 11.75pt; width: 32.4pt"
                      >
                        &nbsp;
                      </td>
                    </tr>
                  </table>
                </span>
              </td>
              <td
                class="xl16318230"
                colspan="2"
                style="border-top: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
              <td
                class="xl16418230"
                style="
                  border-top: 0.5pt solid windowtext;
                  border-right: 0.5pt solid windowtext;
                "
              >
                &nbsp;
              </td>
              <td class="xl9818230">&nbsp;</td>
            </tr>
            <tr
              class="xl10218230"
              height="20"
              style="mso-height-source: userset; height: 13.9pt"
            >
              <td height="20" class="xl10118230" style="height: 13.9pt">
                &nbsp;
              </td>
              <td class="xl10218230">&nbsp;</td>
              <td class="xl10218230">&nbsp;</td>
              <td class="xl10218230">&nbsp;</td>
              <td class="xl10318230">&nbsp;</td>
              <td class="xl10318230">&nbsp;</td>
              <td class="xl10318230">&nbsp;</td>
              <td class="xl10318230">&nbsp;</td>
              <td class="xl10318230">&nbsp;</td>
              <td
                colspan="8"
                class="xl17118230"
                style="
                  border-right: 0.5pt dotted black;
                  border-left: 0.5pt solid windowtext;
                  border-right: 0.5pt solid windowtext;
                "
              >
                <font class="font1418230"
                  >&#272;&#432;&#7907;c ký b&#7903;i:</font
                ><font class="font1518230"> </font
                ><font class="font1618230">{{ mstData.COMPANY_NM }}</font>
              </td>
              <td class="xl10418230">&nbsp;</td>
            </tr>
            <tr height="18" style="mso-height-source: userset; height: 12.55pt">
              <td height="18" class="xl11718230" style="height: 12.55pt">
                &nbsp;
              </td>
              <td class="xl6918230" colspan="3">
                
              </td>
              <td class="xl7118230" width="41" style="width: 27.9pt">&nbsp;</td>
              <td class="xl7118230" width="34" style="width: 25pt">&nbsp;</td>
              <td class="xl7118230" width="62" style="width: 42.3pt">&nbsp;</td>
              <td class="xl7118230" width="27" style="width: 18pt">&nbsp;</td>
              <td class="xl7118230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td
                class="xl16518230"
                colspan="4"
                style="
                  border-left: 0.5pt solid windowtext;
                  border-bottom: 0.5pt solid windowtext;
                "
              >
                Ngày ký:
                <font class="font1718230">{{ mstData.VALID_DATE_FROM }}</font>
              </td>
              <td
                class="xl16618230"
                style="border-bottom: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
              <td
                class="xl16618230"
                style="border-bottom: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
              <td
                class="xl16618230"
                style="border-bottom: 0.5pt solid windowtext"
              >
                &nbsp;
              </td>
              <td
                class="xl16718230"
                style="
                  border-bottom: 0.5pt solid windowtext;
                  border-right: 0.5pt solid windowtext;
                "
              >
                &nbsp;
              </td>
              <td class="xl9718230">&nbsp;</td>
            </tr>
            <tr height="18" style="mso-height-source: userset; height: 12.55pt">
              <td height="18" class="xl11718230" style="height: 12.55pt">
                &nbsp;
              </td>
              <td class="xl10018230" colspan="3">
                Mã nh&#7853;n hóa &#273;&#417;n:
              </td>
              <td class="xl7118230" width="41" style="width: 27.9pt">&nbsp;</td>
              <td class="xl7118230" width="34" style="width: 25pt">&nbsp;</td>
              <td class="xl7118230" width="62" style="width: 42.3pt">&nbsp;</td>
              <td class="xl7118230" width="27" style="width: 18pt">&nbsp;</td>
              <td class="xl7118230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td class="xl7118230" width="56" style="width: 37.8pt">&nbsp;</td>
              <td class="xl7118230" width="30" style="width: 20.7pt">&nbsp;</td>
              <td class="xl7118230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl7118230" width="49" style="width: 33.3pt">&nbsp;</td>
              <td class="xl7118230" width="48" style="width: 32.4pt">&nbsp;</td>
              <td class="xl7118230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl7118230" width="55" style="width: 36.9pt">&nbsp;</td>
              <td class="xl7118230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td class="xl9218230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="20" style="mso-height-source: userset; height: 13.5pt">
              <td height="20" class="xl11718230" style="height: 13.5pt">
                &nbsp;
              </td>
              <td class="xl6518230" colspan="8">
                Tra c&#7913;u t&#7841;i Website:
                <font class="font618230"
                  ><span style="mso-spacerun: yes"> </span></font
                ><font class="font1818230"
                  >http://genuwinsolution.com/e-invoice</font
                >
              </td>
              <td class="xl7118230" width="56" style="width: 37.8pt">&nbsp;</td>
              <td class="xl7118230" width="30" style="width: 20.7pt">&nbsp;</td>
              <td class="xl7118230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl7118230" width="49" style="width: 33.3pt">&nbsp;</td>
              <td class="xl7118230" width="48" style="width: 32.4pt">&nbsp;</td>
              <td class="xl7118230" width="6" style="width: 3.6pt">&nbsp;</td>
              <td class="xl7118230" width="55" style="width: 36.9pt">&nbsp;</td>
              <td class="xl7118230" width="78" style="width: 52.2pt">&nbsp;</td>
              <td class="xl9218230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="16" style="mso-height-source: userset; height: 11pt">
              <td height="16" class="xl8118230" style="height: 11pt">&nbsp;</td>
              <td colspan="16" class="xl16818230">
                (C&#7847;n ki&#7875;m tra, &#273;&#7889;i chi&#7871;u khi
                l&#7853;p, giao nh&#7853;n hóa &#273;&#417;n)
              </td>
              <td class="xl9418230" width="6" style="width: 3.6pt">&nbsp;</td>
            </tr>
            <tr height="16" style="mso-height-source: userset; height: 11pt">
              <td
                height="16"
                class="xl6718230"
                style="height: 11pt; border-top: none"
              >
                &nbsp;
              </td>
              <td colspan="16" class="xl16918230">
                (In t&#7841;i ph&#7847;n m&#7873;m Genuwin E-INVOICE c&#7911;a
                Công ty TNHH MTV GENUWIN SOLUTION - MST: 1201496252)
              </td>
              <td
                class="xl10718230"
                width="6"
                style="border-top: none; width: 3.6pt"
              >
                &nbsp;
              </td>
            </tr>

            <tr height="0" style="display: none">
              <td width="6" style="width: 3.6pt"></td>
              <td width="33" style="width: 25pt"></td>
              <td width="70" style="width: 46.8pt"></td>
              <td width="55" style="width: 36.9pt"></td>
              <td width="41" style="width: 27.9pt"></td>
              <td width="34" style="width: 25pt"></td>
              <td width="62" style="width: 42.3pt"></td>
              <td width="27" style="width: 18pt"></td>
              <td width="78" style="width: 52.2pt"></td>
              <td width="56" style="width: 37.8pt"></td>
              <td width="30" style="width: 20.7pt"></td>
              <td width="6" style="width: 3.6pt"></td>
              <td width="49" style="width: 33.3pt"></td>
              <td width="48" style="width: 32.4pt"></td>
              <td width="6" style="width: 3.6pt"></td>
              <td width="55" style="width: 36.9pt"></td>
              <td width="78" style="width: 52.2pt"></td>
              <td width="6" style="width: 3.6pt"></td>
            </tr>
          </table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.font518230 {
  color: windowtext;
  font-size: 12pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font618230 {
  color: windowtext;
  font-size: 8pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font718230 {
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font818230 {
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font918230 {
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1018230 {
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1118230 {
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1218230 {
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1318230 {
  color: windowtext;
  font-size: 11.5pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1418230 {
  color: red;
  font-size: 10pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1518230 {
  color: red;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1618230 {
  color: red;
  font-size: 8pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1718230 {
  color: red;
  font-size: 9pt;
  font-weight: 700;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1818230 {
  color: #0066cc;
  font-size: 9pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font1918230 {
  color: red;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.font2018230 {
  color: #003366;
  font-size: 11.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: Calibri, sans-serif;
  mso-font-charset: 0;
}
.font2118230 {
  color: red;
  font-size: 12.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: Calibri, sans-serif;
  mso-font-charset: 0;
}
.font2218230 {
  color: red;
  font-size: 11.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
}
.xl6518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl65182301 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 1pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl6618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl66182301 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 1pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl6718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl67182301 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 1pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl6818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl68182301 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 1pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl6918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl7018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
xl70182301 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 1pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl7118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl7218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl7318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl7418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl7518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl7618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 11.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl7718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl7818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl7918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl8018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 11.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: right;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl8118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt solid windowtext;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl8218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl8318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl8418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl8518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt solid windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl8618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt solid windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl8718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: 0.5pt solid windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl8818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl8918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl9018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl9118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl9218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl9318230 {
  padding: 0px;
  mso-ignore: padding;
  color: #c00000;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl9418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: 0.5pt solid windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl9518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 14.6pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl9618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 14.6pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl9718230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl9818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 11.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: bottom;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl9918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl10018230 {
  padding: 0px;
  mso-ignore: padding;
  color: #0070c0;
  font-size: 9pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl10118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl10218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl10318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl10418230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl10518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 14.6pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl10618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl10718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl10818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl10918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl11018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl11118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl11218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl11318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: left;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl11418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl11518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl11618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl11718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl117182301 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 1pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl11818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl11918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl12018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl12118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl12218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl12318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl12418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl12518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl12618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl12718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl12818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl12918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl13018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl13118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl13218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl13318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl13418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl13518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl13618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl13718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: 0%;
  text-align: left;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl13818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl13918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl14018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl14118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt dotted windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl14218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt dotted windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl14318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt dotted windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl14418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl14518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt dotted windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl14618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl14718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl14818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl14918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt dotted windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl15018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt dotted windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl15118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt dotted windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl15218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl15318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl15418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl15518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: general;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl15618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl15718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: general;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl15818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl15918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: right;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16018230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: bottom;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16118230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: bottom;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 11.5pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: bottom;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 11.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: bottom;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 11.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: bottom;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt dotted windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16518230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16618230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16718230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: general;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt dotted windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 8pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt solid windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl16918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 8pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl17018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl17118230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl17218230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl17318230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt dotted windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl17418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl17518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl17618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl17718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: right;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl17818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl17918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl18018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl18118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\#\,\#\#0";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl18218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl18318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl18418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl18518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl18618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl18718230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 12pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl18818230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 12pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl18918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl19018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\@";
  text-align: right;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl19118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: "\#\,\#\#0";
  text-align: right;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl19218230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 9pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt dotted windowtext;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl19318230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 9pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl19418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl19518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt dotted windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl19618230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 9pt;
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: none;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl19718230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl19818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: none;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl19918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt dotted windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl20018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt dotted windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: 0.5pt dotted windowtext;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl20118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl20218230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: 0.5pt solid windowtext;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl20318230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl20418230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: 0.5pt dotted windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl20518230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl20618230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 13.5pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl20718230 {
  padding: 0px;
  mso-ignore: padding;
  color: red;
  font-size: 12.5pt;
  font-weight: 700;
  font-style: italic;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
}
.xl20818230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 12pt;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: center;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: normal;
}
.xl20918230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: none;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl21018230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  border-top: 0.5pt solid windowtext;
  border-right: 0.5pt solid windowtext;
  border-bottom: none;
  border-left: none;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
.xl21118230 {
  padding: 0px;
  mso-ignore: padding;
  color: windowtext;
  font-size: 10pt;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  mso-font-charset: 0;
  mso-number-format: General;
  text-align: left;
  vertical-align: middle;
  background: white;
  mso-pattern: black none;
  white-space: nowrap;
  mso-text-control: shrinktofit;
}
</style>
<script>
 //import { Printd } from 'printd'

export default {
  props: ["paramsResult"],

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    userIdName: "",
    selectedDatas: [],
    mstData: [
      {
        ACC_CCY: "",
        ACC_HOLDER: "",
        ACC_NO: "",
        ADDR: "",
        ADDR1: "",
        ADDR_F: "",
        ADDR_L: "",
        BANK_ACCOUNT1: "",
        BANK_ACCOUNT2: "",
        BANK_NM1: "",
        BANK_NM1_1: "",
        BANK_NM2: "",
        BARCODE: "",
        BRIEF_COM_NM: "",
        COMPANY_CD: "",
        COMPANY_FNM: "",
        COMPANY_LNM: "",
        COMPANY_NM: "",
        CONTACT_ADDR: "",
        CONTACT_COM_PHONE: "",
        CONTACT_EMAIL: "",
        CONTACT_MOBI: "",
        CONTACT_PERSON: "",
        FAX: "",
        FAX_1: "",
        FORM_NO: "",
        FORM_NO_1: "",
        IMG_BACKGROUP: require("@/assets/images/no_image.png"),
        IMG_LOGO: require("@/assets/images/no_image.png"),
        REMARKS: "",
        REPORT_CODE: "",
        REP_PERSON: "",
        SERIAL_NO: "",
        TAX_CODE: "",
        TAX_CODE_1: "",
        TAX_CODE_DISPLAY: "",
        TAX_NAME: "",
        TEL: "",
        TEL_1: "",
        TEMPLATE_FNM: "",
        VALID_DATE_FROM: "",
        WEBSITE_EI: "",
        WEB_SITE: "",
        PK: "",
      },
    ],
    paramsIndex: {},
    txtFormNo: "",
    imageLogo: "",
    imageBackGroup: "",
    imageSign: "",
  }),

  computed: {
    limitHeight() {
      return this.windowHeight;
    },
  },
  watch: {
    paramsResult(val) {
      //console.log('paramsResult O');
      //console.log(val);
        this.paramsIndex = val;
        this.searchMaster(
          this.paramsIndex.TEI_COMPANY_PK,
          this.paramsIndex.REPORT_ID_TYPE,
          this.paramsIndex.PK,
          this.paramsIndex.CONVERT_YN
        );
    },
  },
  created() {
    //console.log('paramsResult C')
    this.searchMaster(
          this.paramsResult.TEI_COMPANY_PK,
          this.paramsResult.REPORT_ID_TYPE,
          this.paramsResult.PK,
          this.paramsResult.CONVERT_YN
        );
    
  },
  methods: {
    async searchMaster(
      p_tei_company_pk,
      p_report_id,
      p_tei_einvoice_issuse_pk,
      p_convert_yn
    ) {
      const dso = {
        type: "control",
        selpro: "AC_SEL_VIEWEINVOICE_POPUP_NO_CACHE",
        para: [
          p_tei_company_pk,
          p_report_id,
          p_tei_einvoice_issuse_pk,
          p_convert_yn,
        ],
      };
      let row = await this._dsoCall(dso, "select", false);
      if (row) {
        this.mstData = {
          ...row,
        };
        
        this.onLoad(
          this.mstData.IMG_LOGO,
          this.mstData.IMG_BACKGROUP,
          this.mstData.IMG_SIGN
        );
      }
    },
    onSelectionChanged({ selectedRowsData }) {
      this.selectedRowsData = selectedRowsData;
    },
    

    bin2String(array) {
      var result = "";
      for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(parseInt(array[i], 2));
      }
      return result;
    },

    async onLoad(data_logo, data_backgroup, data_sign) {
      if (this.mstData.PK > 0) {
        if (data_logo === null) {
          try {
            this.imageLogo = "";
          } catch (e) {}
        } else {
          try {
            let arrayBuffer_logo = data_logo;
            var base64String_logo = this._arrayBufferToBase64(
              arrayBuffer_logo.data
            );
            this.imageLogo = "data:image/png;base64," + base64String_logo;
            //console.log(this.imageLogo);
          } catch (e) {}
        }
      
        if (data_backgroup === null) {
          try {
            this.imageBackGroup = "";
          } catch (e) {}
        } else {
          try {
            let arrayBuffer_backgroup = data_backgroup;
            var base64String_backgroup = this._arrayBufferToBase64(
              arrayBuffer_backgroup.data
            );
            this.imageBackGroup =
              "data:image/png;base64," + base64String_backgroup;
              //console.log(this.imageBackGroup);
          } catch (e) {}
        }
        ////////////////////////////////////////////
        if (data_sign === null) {
          try {
            this.imageSign = "";
          } catch (e) {}
        } else {
          try {
            let arrayBuffer_sign = data_sign;
            var base64String_sign = this._arrayBufferToBase64(
              arrayBuffer_sign.data
            );
            this.imageSign = "data:image/png;base64," + base64String_sign;
            //console.log(this.imageSign);
          } catch (e) {}
        }
      }
    },
    async exportReport(obj) {
      switch (obj) {
        case "EXCEL":
          this.onPrintExcel();
        break;

        case "PDF":
          this.onPrintPDF(
            this.paramsResult.TEI_COMPANY_PK,
            this.user.USER_ID,
            this.paramsResult.REPORT_ID,
            this.paramsResult.PK  
          );
          break;
      }
    },
    onPrintExcel () {
      //  const d = new Printd();
      //  console.log(this.$el);
      //  this.$el = this.$refs.eInvoiceTemplate;
      //  d.print(this.$el, [this.cssText]);
      //  d.print(this.$el, [this.cssText]);, (win, doc, node, launchPrint) => {
      //   // Get style elements
      //   const styles = [].slice.call(document.getElementsByTagName('eInvoiceTemplate'))
      //   // append them to the the new document head element
      //   styles.forEach(styleElement => doc.head.appendChild(styleElement.cloneNode(true)))
      //   launchPrint(win)
      // })
        // // 1. Set the className of the area div to print
        // var newstr = document.getElementsByClassName('eInvoiceTemplate')[0].innerHTML
        // //var newstr = document.getElementsByTagName('eInvoiceTemplate')
        // console.log(newstr)
        // // 2. Copy to body and execute window. print printing
        // document.body.innerHTML = newstr
        // // 3. Restore: Store the old page and return it to the page after printing.
        // var oldstr = document.body.innerHTML
        // window.print()
        // document.body.innerHTML = oldstr
        // return false
    },
     async onPrintPDF(PK, TCO_COMPANY_PK) {
        let p_param = [PK];
        let report_no = "01";
        let report_path = "";
        let report_name = "";      
        let excel = [];
        let report_name_ext = "pdf";


        switch(report_no) { 
          case "01": {
            report_path = "report/60/95/6095050_ajtotal_ah20e_t_c.xlsx"; 
            report_name = "6095050_ajtotal_ah20e_t_c." + report_name_ext; 


            excel = [
              //sheet1
              {
                sheet: 1,               
                 insertRange: [
                   { range: "A1:Q3", proc: "CW_RPT_COMPANY_INFO", params: [TCO_COMPANY_PK]  },//header
                  
                 ],
                  //  insertRows: [
                  //    {                      
                  //      startRow: 15, proc: "CW_RPT_CS40010_01_2", params: [...p_param], stringColumns: [ "ITEM_CODE","ITEM_NAME"],
                  //    }
                  //   ],
              },
            ];

            break;
          }

          default: report_path=""; break;
        }

        if(!report_path) {
          this.showNotification(
              "danger",
              this.$t("please_select_report"),
              "",
              4000
            );
          return;
        }

         const res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel), convert: report_name_ext  } }  );

        if(res){
           this._ExcelSaveAs(res, report_name);         
         } else {
          
           this.showNotification(
             "danger",
           this.$t("fail_to_export_report"),
             "",
             4000
           );
         }

       },
    
  },
};
</script>
