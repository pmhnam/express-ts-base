abstract class RESTFulModule {
  abstract params: {
    list: [];
  };
  abstract getParams(): object;
}
export default RESTFulModule;
