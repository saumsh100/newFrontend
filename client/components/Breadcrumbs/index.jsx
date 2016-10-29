
import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

export default function Breadcrumbs(props) {
  return (
    <Breadcrumb>
      <BreadcrumbItem><a href="#">Home</a></BreadcrumbItem>
      <BreadcrumbItem><a href="#">Library</a></BreadcrumbItem>
      <BreadcrumbItem active>Data</BreadcrumbItem>
    </Breadcrumb>
  );
}
