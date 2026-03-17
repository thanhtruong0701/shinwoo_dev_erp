export default ({ app, $axios, env }, inject) => {
  inject('axiosCreate', () => {
    // Set config defaults when creating the instance
    const instance = $axios.create({
      timeout: env.TIME_OUT ? env.TIME_OUT : 10,
      baseURL: env.LOCAL_API_URL ? env.LOCAL_API_URL : env.API_URL
    });
    return instance
  })
  /* inject('getCommonCode', async (p_parent_code, p_tco_company_pk = 0) => {
    let { data } = await app.$axios.$post("dso/callproc", {
      proc: "sys_sel_common_code",
      para: [p_tco_company_pk, p_parent_code]
    });
    return data ? data : [];
  })
  inject('getCompany', async () => {
    let { data } = await app.$axios.$post("dso/callproc", {
      proc: "sys_get_company"
    });
    return data ? data : [];
  }) */
}
