"use client";

import React from 'react';

interface SafeRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * SafeRender component that prevents objects from being rendered as React children
 * This helps prevent React Error #130
 */
export function SafeRender({ children, fallback = null }: SafeRenderProps) {
  try {
    // Check if children is a valid React node
    if (children === null || children === undefined) {
      return <>{fallback}</>;
    }
    
    // If it's an object (but not a React element), convert to string
    if (typeof children === 'object' && !React.isValidElement(children)) {
      console.warn('SafeRender: Converting object to string to prevent React Error #130', children);
      return <>{JSON.stringify(children)}</>;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.error('SafeRender error:', error);
    return <>{fallback || 'Render error'}</>;
  }
}

/**
 * Higher-order component that wraps content in SafeRender
 */
export function withSafeRender<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const SafeComponent = (props: P) => (
    <SafeRender fallback={<div>Component render error</div>}>
      <WrappedComponent {...props} />
    </SafeRender>
  );
  
  SafeComponent.displayName = `withSafeRender(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return SafeComponent;
}

export default SafeRender;