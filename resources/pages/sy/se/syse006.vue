<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters align="center" justify="space-between">
      <v-col cols="12">
        <BaseTabs ref="tabs">
          <BaseTab :name="$t('user_and_role')">
            <v-row dense align="center" justify="space-between">
              <v-col>
                <BaseInput
                  :label="$t('role_name')"
                  v-model="userAndRole.roleName"
                  @keyPressEnter="onClick('userAndRole')"
                />
              </v-col>
              <v-col>
                <BaseInput
                  :label="$t('user_id')"
                  v-model="userAndRole.userID"
                  @keyPressEnter="onClick('userAndRole')"
                />
              </v-col>
              <v-col>
                <BaseInput
                  :label="$t('emp_id_roll')"
                  v-model="userAndRole.empID"
                  @keyPressEnter="onClick('userAndRole')"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  dense
                  hide-details
                  class="my-0 py-0"
                  true-value="Y"
                  false-value="N"
                  :label="$t('user_active')"
                  v-model="userAndRole.userActive"
                ></v-checkbox>
              </v-col>
              <v-col>
                <div class="d-flex justify-center">
                  <BaseButton
                    btn_type="icon"
                    icon_type="search"
                    :btn_text="$t('search')"
                    @onclick="onClick('userAndRole')"
                  />
                </div>
              </v-col>
            </v-row>
            <BaseGridView
              select_mode="Single"
              ref="userAndRole"
              sel_procedure="SYS_SEL_SYSE006_USERROLE"
              :filter_paras="[
                userAndRole.roleName,
                userAndRole.userID,
                userAndRole.empID,
                userAndRole.userActive,
              ]"
              :header="userAndRoleHeaders"
            />
          </BaseTab>
          <BaseTab :name="$t('object_and_role')">
            <v-row dense align="center" justify="space-between">
              <v-col>
                <BaseInput
                  :label="$t('obj_id')"
                  v-model="objectAndRole.objID"
                  @keyPressEnter="onClick('objectAndRole')"
                />
              </v-col>
              <v-col>
                <BaseInput
                  :label="$t('obj_name')"
                  v-model="objectAndRole.objName"
                  @keyPressEnter="onClick('objectAndRole')"
                />
              </v-col>
              <v-col>
                <BaseInput
                  :label="$t('role')"
                  v-model="objectAndRole.role"
                  @keyPressEnter="onClick('objectAndRole')"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  dense
                  hide-details
                  class="my-0 py-0"
                  true-value="Y"
                  false-value="N"
                  :label="$t('used_obj')"
                  v-model="objectAndRole.usedObj"
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox
                  dense
                  hide-details
                  class="my-0 py-0"
                  true-value="Y"
                  false-value="N"
                  :label="$t('used_role')"
                  v-model="objectAndRole.usedRole"
                ></v-checkbox>
              </v-col>
              <v-col>
                <div class="d-flex justify-center">
                  <BaseButton
                    btn_type="icon"
                    icon_type="search"
                    :btn_text="$t('search')"
                    @onclick="onClick('objectAndRole')"
                  />
                </div>
              </v-col>
            </v-row>
            <BaseGridView
              select_mode="Single"
              ref="objAndRole"
              sel_procedure="SYS_SEL_SYSE006_OBJROLE"
              :filter_paras="[
                objectAndRole.objID,
                objectAndRole.objName,
                objectAndRole.role,
                objectAndRole.usedObj,
                objectAndRole.usedRole,
              ]"
              :header="objectAndRoleHeaders"
            />
          </BaseTab>
          <BaseTab :name="$t('object_and_user')">
            <v-row dense align="center" justify="space-between">
              <v-col>
                <BaseInput
                  :label="$t('user_id')"
                  v-model="objectAndUser.userID"
                  @keyPressEnter="onClick('objectAndUser')"
                />
              </v-col>
              <v-col>
                <BaseInput
                  :label="$t('obj_id')"
                  v-model="objectAndUser.objID"
                  @keyPressEnter="onClick('objectAndUser')"
                />
              </v-col>
              <v-col>
                <BaseInput
                  :label="$t('obj_name')"
                  v-model="objectAndUser.objName"
                  @keyPressEnter="onClick('objectAndUser')"
                />
              </v-col>
              <v-col>
                <BaseInput
                  :label="$t('role_name')"
                  v-model="objectAndUser.roleName"
                  @keyPressEnter="onClick('objectAndUser')"
                />
              </v-col>
              <v-col>
                <div class="d-flex align-center justify-space-between">
                  <v-checkbox
                    dense
                    hide-details
                    class="my-0 py-0"
                    true-value="Y"
                    false-value="N"
                    :label="$t('used_obj')"
                    v-model="objectAndUser.usedObj"
                  ></v-checkbox>
                  <v-checkbox
                    dense
                    hide-details
                    class="my-0 py-0"
                    true-value="Y"
                    false-value="N"
                    :label="$t('used_user')"
                    v-model="objectAndUser.usedUser"
                  ></v-checkbox>
                </div>
              </v-col>
              <v-col>
                <div class="d-flex justify-end">
                  <BaseButton
                    btn_type="icon"
                    icon_type="search"
                    :btn_text="$t('search')"
                    @onclick="onClick('objectAndUser')"
                  />
                </div>
              </v-col>
            </v-row>
            <BaseGridView
              select_mode="Single"
              ref="objAndUser"
              sel_procedure="SYS_SEL_SYSE006_OBJUSER"
              :filter_paras="[
                objectAndUser.userID,
                objectAndUser.objID,
                objectAndUser.objName,
                objectAndUser.roleName,
                objectAndUser.usedObj,
                objectAndUser.usedUser,
              ]"
              :header="objectAndUserHeaders"
            />
          </BaseTab>
        </BaseTabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "default",

  data: () => ({
    userAndRole: {
      roleName: "",
      userID: "",
      empID: "",
      userActive: "Y",
    },
    objectAndRole: {
      objID: "",
      objName: "",
      role: "",
      usedObj: "Y",
      usedRole: "Y",
    },
    objectAndUser: {
      userID: "",
      objID: "",
      objName: "",
      roleName: "",
      usedObj: "Y",
      usedUser: "Y",
    },
  }),

  created() {},

  mounted() {},

  computed: {
    userAndRoleHeaders() {
      return [
        {
          dataField: "EMP_ID",
          caption: this.$t("emp_id"),
          allowEditing: false,
        },
        {
          dataField: "DEPT_NAME",
          caption: this.$t("dept_name"),
          allowEditing: false,
        },
        {
          dataField: "JOIN_DT",
          caption: this.$t("join_dt"),
          allowEditing: false,
          dataType: "date",
        },
        {
          dataField: "NATIONS",
          caption: this.$t("nation"),
          allowEditing: false,
        },
        {
          dataField: "USER_ID",
          caption: this.$t("user_id"),
          allowEditing: false,
        },
        {
          dataField: "USER_NAME",
          caption: this.$t("full_name"),
          allowEditing: false,
        },
        {
          dataField: "ROLE_NM",
          caption: this.$t("role_name"),
          allowEditing: false,
        },
        {
          dataField: "USE_YN",
          caption: this.$t("active"),
          allowEditing: false,
          dataType: "checkbox",
        },
        {
          dataField: "CRT_DT",
          caption: this.$t("crt_dt"),
          allowEditing: false,
          dataType: "date",
        },
        {
          dataField: "CRT_BY",
          caption: this.$t("crt_by"),
          allowEditing: false,
        },
      ];
    },
    objectAndRoleHeaders() {
      return [
        {
          dataField: "MENU_CD",
          caption: this.$t("obj_id"),
          allowEditing: false,
        },
        {
          dataField: "FORM_NM",
          caption: this.$t("obj_name"),
          allowEditing: false,
        },
        {
          dataField: "MENU_CD_2",
          caption: this.$t("menu_id"),
          allowEditing: false,
        },
        {
          dataField: "",
          caption: this.$t("obj_start_dt"),
          allowEditing: false,
          dataType: "date",
        },
        {
          dataField: "ROLE_NM",
          caption: this.$t("role_name"),
          allowEditing: false,
        },
        {
          dataField: "ST_DATE",
          caption: this.$t("start_dt"),
          allowEditing: false,
          dataType: "date",
        },
      ];
    },
    objectAndUserHeaders() {
      return [
        {
          dataField: "USER_ID",
          caption: this.$t("user_id"),
          allowEditing: false,
        },
        {
          dataField: "USER_NAME",
          caption: this.$t("full_name"),
          allowEditing: false,
        },
        {
          dataField: "MENU_CD",
          caption: this.$t("obj_id"),
          allowEditing: false,
        },
        {
          dataField: "FORM_NM",
          caption: this.$t("obj_name"),
          allowEditing: false,
        },
        {
          dataField: "MENU_CD_2",
          caption: this.$t("menu_id"),
          allowEditing: false,
        },
        {
          dataField: "ROLE_NM",
          caption: this.$t("role_name"),
          allowEditing: false,
        },
        {
          dataField: "OBJ_USED",
          caption: this.$t("obj_used"),
          allowEditing: false,
          dataType: "checkbox",
        },
        {
          dataField: "ROLE_USED",
          caption: this.$t("role_used"),
          allowEditing: false,
          dataType: "checkbox",
        },
        {
          dataField: "ROLE_OBJ_USED",
          caption: this.$t("role_obj_used"),
          allowEditing: false,
          dataType: "checkbox",
        },
        {
          dataField: "USER_USED",
          caption: this.$t("user_used"),
          allowEditing: false,
          dataType: "checkbox",
        },
        {
          dataField: "USER_ROLE_USED",
          caption: this.$t("user_role_used"),
          allowEditing: false,
          dataType: "checkbox",
        },
      ];
    },
  },

  methods: {
    onClick(type) {
      console.log(type);
      switch (type) {
        case "userAndRole":
          this.$refs.userAndRole.loadData();
          break;
        case "objectAndRole":
          this.$refs.objAndRole.loadData();
          break;
        case "objectAndUser":
          this.$refs.objAndUser.loadData();
          break;
        default:
          break;
      }
    },
  },
};
</script>
