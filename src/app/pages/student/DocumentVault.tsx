import React, { useState, useRef } from 'react';
import { useNexus, Document } from '../../context/NexusContext';
import { 
  UploadCloud, 
  File, 
  Trash2, 
  RefreshCw, 
  Eye, 
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';

export function DocumentVault() {
  const { documents, uploadDocument, deleteDocument } = useNexus();
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const docTypes = ['ID Card', 'Library Receipt', 'Lab Manual', 'Hostel Clearance', 'Other'];

  const validateAndUpload = (file: File) => {
    setError('');
    
    if (!['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Only PDF and JPEG files are accepted.');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setError('File exceeds 2MB limit.');
      return;
    }
    
    if (!selectedType) {
      setError('Please select a document type.');
      return;
    }

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newDoc: Document = {
        id: `doc_${Date.now()}`,
        name: file.name,
        type: selectedType,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Under Review'
      };
      
      uploadDocument(newDoc);
      setUploading(false);
      setSelectedType('');
    }, 1500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Verified': return 'text-[#1040C0] bg-[#1040C0]/10 border-[#1040C0]';
      case 'Under Review': return 'text-[#F0C020] bg-[#F0C020]/10 border-[#F0C020]';
      case 'Rejected': return 'text-[#D02020] bg-[#D02020]/10 border-[#D02020]';
      default: return 'text-gray-600 bg-gray-100 border-gray-600';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      
      <div>
        <h1 className="font-black text-3xl md:text-5xl uppercase tracking-tight mb-2">Document Vault</h1>
        <p className="text-lg font-medium opacity-80">Upload and manage all required clearance proofs safely.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white border-4 border-[#121212] p-6 shadow-[4px_4px_0px_0px_#121212] flex flex-col md:flex-row gap-6">
        
        <div className="md:w-1/3 flex flex-col justify-center space-y-4">
           <div>
              <label className="font-black uppercase text-xs tracking-widest mb-2 block">1. Select Document Type</label>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border-2 border-[#121212] p-3 font-bold uppercase text-sm outline-none focus:border-4 transition-all bg-[#F0F0F0]"
              >
                <option value="">-- Choose Type --</option>
                {docTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
           </div>
           {error && (
             <div className="p-3 bg-[#D02020]/10 border-2 border-[#D02020] text-[#D02020] font-bold text-xs flex items-center gap-2 uppercase">
               <AlertTriangle className="w-4 h-4" /> {error}
             </div>
           )}
        </div>

        <div className="md:w-2/3">
           <label className="font-black uppercase text-xs tracking-widest mb-2 block">2. Upload File</label>
           <div 
             className={`w-full border-4 border-dashed transition-all flex flex-col items-center justify-center p-8 relative ${
               dragActive ? 'border-[#1040C0] bg-[#1040C0]/5' : 'border-[#121212] bg-[#F9F9F9] hover:bg-[#F0F0F0]'
             } ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
             onDragEnter={handleDrag}
             onDragLeave={handleDrag}
             onDragOver={handleDrag}
             onDrop={handleDrop}
             onClick={onButtonClick}
           >
             <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf, .jpg, .jpeg"
                onChange={handleChange}
              />
             
             {uploading ? (
               <div className="flex flex-col items-center">
                 <RefreshCw className="w-10 h-10 mb-4 animate-spin text-[#1040C0]" />
                 <p className="font-black uppercase text-sm tracking-widest">Uploading Document...</p>
                 <div className="w-48 h-2 bg-[#E0E0E0] mt-4 rounded-full overflow-hidden border border-[#121212]">
                   <div className="w-full h-full bg-[#1040C0] animate-[pulse_1s_ease-in-out_infinite]" />
                 </div>
               </div>
             ) : (
               <>
                 <UploadCloud className="w-10 h-10 mb-4 text-[#121212]" strokeWidth={2} />
                 <p className="font-black text-lg uppercase tracking-tight mb-1 text-center">Drag & Drop or Click to Browse</p>
                 <p className="text-sm font-medium opacity-60 text-center">Accepted: PDF, JPEG (Max 2MB)</p>
               </>
             )}
           </div>
        </div>

      </div>

      {/* Document Grid */}
      <div>
        <h2 className="font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-2">
          <span className="w-4 h-4 bg-[#1040C0] inline-block border-2 border-[#121212]" />
          Uploaded Vault
        </h2>
        
        {documents.length === 0 ? (
          <div className="p-10 border-4 border-[#121212] border-dashed text-center">
            <p className="font-bold uppercase tracking-widest opacity-50">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className={`bg-white border-4 p-5 flex flex-col justify-between transition-all hover:shadow-[4px_4px_0px_0px_#121212] ${
                doc.status === 'Rejected' ? 'border-[#D02020]' : 'border-[#121212]'
              }`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#F0F0F0] border-2 border-[#121212]">
                      <File className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-1 border-2 font-bold text-[10px] uppercase tracking-wider ${getStatusColor(doc.status)}`}>
                       {doc.status}
                    </span>
                  </div>
                  
                  <h3 className="font-black uppercase tracking-tight line-clamp-1 mb-1" title={doc.name}>{doc.name}</h3>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60 mb-4">
                    <span>{doc.type}</span>
                    <span>{doc.size}</span>
                  </div>

                  {doc.status === 'Rejected' && doc.rejectionReason && (
                    <div className="mb-4 p-3 bg-[#D02020]/10 border-l-4 border-[#D02020]">
                      <p className="text-xs font-bold text-[#D02020] uppercase tracking-wider mb-1">Reason for Rejection</p>
                      <p className="text-sm font-medium leading-tight text-[#121212]">"{doc.rejectionReason}"</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t-2 border-[#F0F0F0] flex gap-2">
                  {doc.status === 'Rejected' ? (
                     <button onClick={() => { deleteDocument(doc.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="flex-1 bg-[#D02020] text-white py-2 border-2 border-[#121212] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700">
                       <RefreshCw className="w-3 h-3" /> Re-upload
                     </button>
                  ) : (
                     <>
                       <button onClick={() => setPreviewDoc(doc)} className="flex-1 bg-white py-2 border-2 border-[#121212] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F0F0F0]">
                         <Eye className="w-3 h-3" /> View
                       </button>
                       <button onClick={() => deleteDocument(doc.id)} className="px-3 bg-white border-2 border-[#121212] hover:bg-[#D02020] hover:text-white transition-colors group">
                         <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-white" />
                       </button>
                     </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mock Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setPreviewDoc(null)} />
          <div className="relative bg-[#F0F0F0] w-full max-w-3xl border-4 border-[#121212] h-[80vh] flex flex-col">
             <div className="bg-[#121212] text-white p-4 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <File className="w-5 h-5" />
                 <h2 className="font-black text-sm uppercase tracking-widest">{previewDoc.name}</h2>
               </div>
               <button onClick={() => setPreviewDoc(null)} className="hover:bg-white/20 p-1"><X className="w-5 h-5" /></button>
             </div>
             <div className="flex-1 flex items-center justify-center overflow-hidden p-8">
                {/* Mocked Document Viewer */}
                <div className="w-full max-w-sm aspect-[1/1.4] bg-white border-2 border-[#E0E0E0] shadow-xl p-8 flex flex-col items-center justify-center relative">
                   <div className="absolute top-4 left-4 font-black text-[#E0E0E0] text-6xl uppercase opacity-30 select-none">Mock</div>
                   <CheckCircle2 className="w-16 h-16 text-[#F0C020] mb-4" />
                   <p className="font-black uppercase tracking-tight text-xl text-center">Verified Scan</p>
                   <p className="text-sm font-medium opacity-60 mt-2">Displaying preview for {previewDoc.type}</p>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
