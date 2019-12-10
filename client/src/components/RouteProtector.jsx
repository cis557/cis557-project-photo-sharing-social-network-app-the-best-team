/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Loader from 'react-loader-spinner';
import { Redirect } from 'react-router-dom';
import { checkAuth } from '../javascripts/authRequests';

const RouteProtector = (Component) => class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    checkAuth().then((res) => {
      this.setState({ isAuthenticated: res.status === 200, isLoading: false });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { isAuthenticated, isLoading } = this.state;

    if (isLoading) {
      return (
        <div style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
        }}
        >
          <div style={{
            margin: 'auto',
            maxHeight: '100%',
          }}
          >
            <Loader type="TailSpin" color="#555F80" height={100} width={100} timeout={30000} />
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return <Component {...this.props} />;
  }
};

export default RouteProtector;
