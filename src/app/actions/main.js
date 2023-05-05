const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

const onSetSocket = (action) => ({
  type: 'SET_SOCKET',
  socket: action,
});

const onOpenKey = (action) => ({
  type: 'OPENKEY',
  openKey: action,
});

const onSelectedKey = (action) => ({
  type: 'SELECTEDKEY',
  selectedKey: action,
});

const onSelectedHeaderKey = (action) => ({
  type: 'SELECTEDHEADERKEY',
  selectedHeaderKey: action,
});

const onCollapsed = (action) => ({
  type: 'COLLAPSED',
  collapsedSider: action,
});

const onMobile = (action) => ({
  type: 'ISMOBILE',
  isMobile: action,
});

export default {
  onLoading,
  onOpenKey,
  onSelectedKey,
  onCollapsed,
  onMobile,
  onSelectedHeaderKey,
  onSetSocket,
};
