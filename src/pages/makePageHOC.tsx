import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { pageLoaded, pageUnloaded } from "app/actions";

export function makePage(Page: React.ComponentType) {
  function InheritedLayer(props: any) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(pageLoaded({ name: Page.name }));

      return () => {
        dispatch(pageUnloaded({ name: Page.name }));
      };
    }, [dispatch]);

    return <Page {...props} />;
  }

  return InheritedLayer;
}

export default makePage;
