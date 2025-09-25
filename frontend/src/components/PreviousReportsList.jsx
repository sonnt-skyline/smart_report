import { useState, useEffect } from 'react';
import { weeklyReportAPI } from '../utils/api';

export default function PreviousReportsList({ isVisible, onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [detailsError, setDetailsError] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadPreviousReports();
    }
  }, [isVisible]);

  const loadPreviousReports = async () => {
    setLoading(true);
    try {
      // Use new API format with pagination parameters
      const previousReports = await weeklyReportAPI.getPreviousReports(1, 10);
      setReports(previousReports);
    } catch (error) {
      console.error('Failed to load previous reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReportDetails = async (week) => {
    setDetailsError(false);
    try {
      const details = await weeklyReportAPI.getReportDetails(week);
      console.log('Report details received:', details);
      console.log('Actions in report:', details.actions);
      setReportDetails(details);
      setSelectedReport(week);
    } catch (error) {
      console.error('Failed to load report details:', error);
      setDetailsError(true);
      // Don't show details if API fails - user will see the error in console
      // and can try again or contact support
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="previous-reports-overlay">
      <div className="previous-reports-modal">
        <div className="modal-header">
          <h2>📋 Previous Reports</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {!selectedReport ? (
            // Reports List View
            <div className="reports-list">
              {loading ? (
                <div className="loading-state">Loading previous reports...</div>
              ) : reports.length === 0 ? (
                <div className="empty-state">
                  <p>No previous reports found.</p>
                  <p>Submit your first report to see it here!</p>
                </div>
              ) : (
                <div className="reports-grid">
                  {reports.map(report => (
                    <div 
                      key={report.id} 
                      className="report-card"
                      onClick={() => loadReportDetails(report.week)}
                    >
                      <div className="report-week">{report.week}</div>
                      <div className="report-date">
                        Submitted: {formatDate(report.submittedAt)}
                      </div>
                      <div className="report-stats">
                        <span className="actions-count">
                          {report.actionsCount} actions updated
                        </span>
                      </div>
                      {report.notes && (
                        <div className="report-preview">
                          {report.notes.substring(0, 100)}...
                        </div>
                      )}
                      <div className="view-details">Click to view details →</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Report Details View
            <div className="report-details">
              {detailsError ? (
                <div className="details-error">
                  <button 
                    className="back-button"
                    onClick={() => {
                      setSelectedReport(null);
                      setDetailsError(false);
                    }}
                  >
                    ← Back to Reports
                  </button>
                  <div className="error-content">
                    <h3>Failed to Load Report</h3>
                    <p>Sorry, we couldn't load the details for this report. Please try again or contact support if the problem persists.</p>
                    <button 
                      className="retry-button"
                      onClick={() => loadReportDetails(selectedReport)}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
              <div className="report-details-content">
              <div className="details-header">
                <button 
                  className="back-button"
                  onClick={() => setSelectedReport(null)}
                >
                  ← Back to Reports
                </button>
                <h3>Report for {reportDetails?.week}</h3>
                <p className="submission-date">
                  Submitted: {formatDate(reportDetails?.submittedAt)}
                </p>
              </div>

              <div className="details-content">
                {reportDetails?.progress_notes && (
                  <div className="detail-section">
                    <h4>Progress</h4>
                    <p>{reportDetails.progress_notes}</p>
                  </div>
                )}

                {reportDetails?.blockers_notes && (
                  <div className="detail-section">
                    <h4>Blockers</h4>
                    <p>{reportDetails.blockers_notes}</p>
                  </div>
                )}

                {reportDetails?.next_steps_notes && (
                  <div className="detail-section">
                    <h4>Next Steps</h4>
                    <p>{reportDetails.next_steps_notes}</p>
                  </div>
                )}

                {reportDetails?.additional_notes && (
                  <div className="detail-section">
                    <h4>Additional Notes</h4>
                    <p>{reportDetails.additional_notes}</p>
                  </div>
                )}

                {reportDetails?.actions && reportDetails.actions.length > 0 && (
                  <div className="detail-section">
                    <h4>Actions Updated ({reportDetails.actions.length})</h4>
                    <div className="actions-list">
                      {reportDetails.actions.map((action, index) => {
                        console.log(`Action ${index}:`, action);
                        console.log(`Progress value:`, action.progress, typeof action.progress);
                        return (
                          <div key={index} className="action-item">
                            <div className="action-title">{action.title}</div>
                            <div className="action-status">
                              <span className={`status-badge ${action.work_status?.toLowerCase().replace(' ', '-') || 'unknown'}`}>
                                {action.work_status || 'Unknown'}
                              </span>
                              <span className="progress-value">{action.progress || 0}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
