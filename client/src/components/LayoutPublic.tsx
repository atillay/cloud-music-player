import React from 'react';
import {Icon} from "antd";

const LayoutPublic: React.FC<PublicLayoutProps> = (props) => {
  return (
    <div className="layout-public">
      <aside className="side-content"/>
      <section className="main-content">
        <div className="logo">
          <Icon type="play-circle" style={{marginRight: '4px'}}/> Cloud Music Player
        </div>
        {props.children}
      </section>
    </div>
  )
};

interface PublicLayoutProps {}

export default LayoutPublic;
