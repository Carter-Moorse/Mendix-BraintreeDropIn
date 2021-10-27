declare module mx {
    module ui {
      function showProgress(msg?: string, modal?: boolean): number;
      function hideProgress(id?: number): undefined;
    }
}