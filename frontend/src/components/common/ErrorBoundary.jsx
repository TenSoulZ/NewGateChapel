import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Global Error Boundary to catch JavaScript errors anywhere in their child component tree.
 * Displays a glassmorphism-styled fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
            <div className="glass-panel p-5 border-danger border-opacity-25">
                <div className="text-danger mb-4">
                    <FaExclamationTriangle size={60} />
                </div>
                <h1 className="display-5 fw-bold mb-3 text-gradient">Something went wrong</h1>
                <p className="lead text-muted mb-5">
                    We apologize for the inconvenience. The application encountered an unexpected error.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                    <Button variant="primary" onClick={this.handleReload} className="px-4">
                        Refresh Page
                    </Button>
                    <Button variant="outline-light" href="/" className="px-4">
                        Go Home
                    </Button>
                </div>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                    <div className="mt-5 text-start bg-dark p-3 rounded overflow-auto" style={{ maxHeight: '200px', maxWidth: '100%' }}>
                        <code className="text-danger small">
                            {this.state.error.toString()}
                            <br />
                            {this.state.errorInfo.componentStack}
                        </code>
                    </div>
                )}
            </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
