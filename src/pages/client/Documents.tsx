import React, { useEffect, useState } from 'react';
import { db, ProjectDocument } from '../../data/db';
import { toast } from 'react-hot-toast';
import { FiFileText, FiDownload, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export const Documents: React.FC = () => {
  const projectId = 'seraphina-wedding';
  const [docs, setDocs] = useState<ProjectDocument[]>([]);

  const loadDocs = () => {
    db.getProjectDocuments(projectId).then(setDocs);
  };

  useEffect(() => {
    loadDocs();
    const unsub = db.subscribeToProjectChanges(projectId, () => {
      loadDocs();
    });
    return unsub;
  }, []);

  const handleApprove = async (id: string, name: string) => {
    try {
      await db.updateDocumentStatus(id, 'approved');
      toast.success(`Approved: ${name}`);
      await db.addProjectTimeline(projectId, 'document_uploaded', `Client approved document: "${name}"`);
      loadDocs();
    } catch (err) {
      toast.error('Failed to approve document.');
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      await db.updateDocumentStatus(id, 'rejected');
      toast.error(`Rejected: ${name}`);
      await db.addProjectTimeline(projectId, 'document_uploaded', `Client rejected document: "${name}"`);
      loadDocs();
    } catch (err) {
      toast.error('Failed to reject document.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          Document Approvals
        </h1>
        <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
          Review event blueprints, sign off on styling quotations, and inspect vendor contracts.
        </p>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  doc.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                  doc.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {doc.status}
                </span>
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">{doc.type}</span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0"><FiFileText size={20} /></div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-heading font-bold text-neutral-900 dark:text-zinc-200 truncate" title={doc.name}>
                    {doc.name}
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5 font-mono">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-8 pt-4 border-t border-neutral-150 dark:border-zinc-850/60">
              <a
                href={doc.url}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 p-2 rounded-lg border border-neutral-250 dark:border-zinc-800 text-neutral-600 dark:text-zinc-400 hover:text-amber-500 hover:border-amber-500/50 text-xs font-bold uppercase transition-colors"
                title="Download Document"
              >
                <FiDownload /> Download
              </a>

              {doc.status === 'pending' && (
                <div className="flex gap-2 flex-grow justify-end">
                  <button
                    onClick={() => handleApprove(doc.id, doc.name)}
                    className="inline-flex items-center gap-1 py-2 px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <FiCheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(doc.id, doc.name)}
                    className="inline-flex items-center gap-1 py-2 px-3.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <FiXCircle /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Documents;
