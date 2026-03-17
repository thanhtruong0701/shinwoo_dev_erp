export default ({ store, redirect }) => {
  if (!store.getters["auth/user"] || !store.getters["lang/languages"]) {
    redirect("/login");
  }
}