import React from 'react';
import {observer} from "mobx-react";

export const CategoriesViewScreen = ( props: any) => {
  return <React.Fragment>
      <CategoriesAddressLine />
      <CategoryEditor />
      <CategoriesList />
  </React.Fragment>
};

class CategoryEditor extends React.Component<any, {}> {

    render() {
        return <div>Form</div>
    }
}

const CategoriesAddressLine =observer( (props: any) => {

    return <div>Address</div>
});

const CategoriesList = observer((props: any) => {

    return <div>List</div>
});