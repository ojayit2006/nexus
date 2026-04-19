import React, { useState } from 'react';
import { useNexus, Department } from '../../context/NexusContext';
import { 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Send,
  X,
  Paperclip,
  Flame
} from 'lucide-react';

export function MyApplication() {
  const { profile, departments } = useNexus();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [respondModal, setRespondModal] = useState<Department | null>(null);

  // Derive global application states
  const labStatus = departments.find(d => d.id === 'lab')?.status;
  const hodStatus = departments.find(d => d.id === 'hod')?.status;
  const prinStatus = departments.find(d => d.id === 'prin')?.status;

  const steps = [
    { label: 'Student Submitted', status: 'Completed', date: 'Jun 8', person: profile.name },
    { label: 'Lab In-charge', status: labStatus === 'Cleared' ? 'Completed' : labStatus === 'Pending' ? 'In Progress' : 'Pending', date: labStatus === 'Cleared' ? 'Jun 10' : '-', person: 'Dr. Mehta' },
    { label: 'HOD', status: hodStatus === 'Cleared' ? 'Completed' : hodStatus === 'Pending' ? 'In Progress' : 'Pending', date: hodStatus === 'Cleared' ? 'Jun 12' : '-', person: 'Prof. Sharma' },
    { label: 'Principal', status: prinStatus === 'Cleared' ? 'Completed' : prinStatus === 'Pending' ? 'In Progress' : 'Pending', date: '-', person: 'Dr. Rao' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'Cleared') return <span className="inline-block px-3 py-1 bg-[#1040C0] text-white font-bold text-xs uppercase tracking-wider border-2 border-[#121212]">Cleared</span>;
    if (status === 'Pending') return <span className="inline-block px-3 py-1 bg-[#F0C020] text-[#121212] font-bold text-xs uppercase tracking-wider border-2 border-[#121212]">Pending</span>;
    if (status === 'Action Required') return <span className="inline-block px-3 py-1 bg-[#D02020] text-white font-bold text-xs uppercase tracking-wider border-2 border-[#121212]">Action Reqd</span>;
    return <span className="inline-block px-3 py-1 bg-[#E0E0E0] text-[#121212] font-bold text-xs uppercase tracking-wider border-2 border-[#121212]">Unknown</span>;
  };

  const handleRespondSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Response submitted to ${respondModal?.name}`);
    setRespondModal(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div>
        <h1 className="font-black text-3xl md:text-5xl uppercase tracking-tight mb-2">Track Application</h1>
        <p className="text-lg font-medium opacity-80">Application ID: NX-2026-8809</p>
      </div>

      {/* Stepper */}
      <div className="bg-white border-4 border-[#121212] p-6 md:p-8 shadow-[4px_4px_0px_0px_#121212]">
        <h2 className="font-black text-xl uppercase tracking-tight mb-8">Chain of Approval</h2>
        
        <div className="relative">
          <div className="absolute top-5 left-8 right-8 h-2 bg-[#E0E0E0] border-y-2 border-[#121212] hidden md:block" />
          <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-0">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-row md:flex-col items-center md:w-1/4 relative z-10 gap-4 md:gap-3">
                <div className={`w-12 h-12 rounded-full border-4 border-[#121212] flex items-center justify-center shrink-0 transition-colors ${
                  step.status === 'Completed' ? 'bg-[#1040C0] text-white' :
                  step.status === 'In Progress' ? 'bg-[#F0C020] text-[#121212]' : 'bg-white text-[#E0E0E0]'
                }`}>
                  {step.status === 'Completed' ? <CheckCircle className="w-6 h-6" /> : 
                   step.status === 'In Progress' ? <Circle className="w-6 h-6 animate-pulse" /> : 
                   <Circle className="w-6 h-6 opacity-30" />}
                </div>
                <div className="text-left md:text-center">
                  <p className="font-black uppercase tracking-tight text-sm md:text-base leading-tight mb-1">{step.label}</p>
                  <p className="font-bold text-[10px] uppercase tracking-widest opacity-60 bg-[#F0F0F0] inline-block px-1 mb-1">{step.status}</p>
                  <p className="text-sm font-medium opacity-80">{step.person}</p>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CLEARANCE HEATMAP ─────────────────────────────────────────────── */}
      <div className="bg-white border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212] overflow-hidden">
        <div className="bg-[#121212] text-white p-5 border-b-4 border-[#121212] flex items-center justify-between">
          <h2 className="font-black text-xl uppercase tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#F0C020]" /> Clearance Heatmap
          </h2>
          <span className="font-mono text-sm opacity-70">
            {departments.filter(d => d.status === 'Cleared').length} / {departments.length} cleared
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-6">

          {/* Progress bar */}
          {(() => {
            const pct = departments.length === 0 ? 0 : Math.round((departments.filter(d => d.status === 'Cleared').length / departments.length) * 100);
            return (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-xs uppercase tracking-widest opacity-60">Overall Progress</span>
                  <span className="font-black text-lg tracking-tighter"
                    style={{ color: pct === 100 ? '#10A35A' : pct > 50 ? '#1040C0' : '#D02020' }}>
                    {pct}%
                  </span>
                </div>
                <div className="h-5 border-4 border-[#121212] bg-[#F0F0F0] overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100
                        ? 'linear-gradient(90deg,#10A35A,#0D8A4C)'
                        : pct > 50
                          ? 'linear-gradient(90deg,#1040C0,#0A30A0)'
                          : 'linear-gradient(90deg,#F0C020,#D02020)',
                    }}
                  />
                </div>
              </div>
            );
          })()}

          {/* Heatmap grid */}
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(departments.length, 5)}, 1fr)` }}>
            {departments.map((dept) => {
              const bg =
                dept.status === 'Cleared'         ? '#10A35A' :
                dept.status === 'Action Required' ? '#D02020' :
                                                    '#F0C020';
              const fg =
                dept.status === 'Pending' ? '#121212' : '#FFFFFF';
              const intensity =
                dept.status === 'Cleared'         ? '1'   :
                dept.status === 'Action Required' ? '0.9' :
                                                    '0.85';
              return (
                <div
                  key={dept.id}
                  title={`${dept.name}: ${dept.status}`}
                  style={{ background: bg, opacity: intensity }}
                  className="relative border-4 border-[#121212] p-4 flex flex-col items-center justify-center text-center min-h-[110px] shadow-[4px_4px_0px_0px_#121212] cursor-default group transition-transform hover:-translate-y-1 hover:shadow-[4px_8px_0px_0px_#121212]"
                >
                  {/* Pulse for action-required */}
                  {dept.status === 'Action Required' && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  )}

                  <p style={{ color: fg }} className="font-black text-[11px] uppercase tracking-widest leading-tight mb-2">
                    {dept.name}
                  </p>

                  {/* Icon */}
                  <div style={{ color: fg }} className="mb-2">
                    {dept.status === 'Cleared' && <CheckCircle className="w-7 h-7" />}
                    {dept.status === 'Pending' && <Circle className="w-7 h-7 opacity-80" />}
                    {dept.status === 'Action Required' && <AlertCircle className="w-7 h-7" />}
                  </div>

                  <span
                    style={{ background: 'rgba(0,0,0,0.18)', color: fg }}
                    className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5"
                  >
                    {dept.status}
                  </span>

                  {/* Tooltip on hover */}
                  {dept.note && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#121212] text-white text-[10px] font-bold uppercase tracking-wide px-3 py-2 w-48 text-center border-2 border-[#F0C020] z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                      {dept.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-2 border-t-2 border-[#E0E0E0]">
            {[
              { color: '#10A35A', label: 'Cleared' },
              { color: '#F0C020', label: 'Pending' },
              { color: '#D02020', label: 'Action Required' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#121212] shrink-0" style={{ background: color }} />
                <span className="font-bold text-xs uppercase tracking-widest opacity-70">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212] overflow-hidden">
        <div className="bg-[#121212] text-white p-5 border-b-4 border-[#121212]">
          <h2 className="font-black text-xl uppercase tracking-tight">Department Summary</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F0F0F0] border-b-4 border-[#121212]">
                <th className="p-4 font-black uppercase text-sm tracking-widest border-r-2 border-[#E0E0E0]">Department</th>
                <th className="p-4 font-black uppercase text-sm tracking-widest border-r-2 border-[#E0E0E0]">Authority</th>
                <th className="p-4 font-black uppercase text-sm tracking-widest border-r-2 border-[#E0E0E0]">Status</th>
                <th className="p-4 font-black uppercase text-sm tracking-widest w-12 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <React.Fragment key={dept.id}>
                  <tr 
                    className={`border-b-2 border-[#E0E0E0] hover:bg-[#F9F9F9] transition-colors cursor-pointer ${expandedRow === dept.id ? 'bg-[#F9F9F9]' : ''}`}
                    onClick={() => setExpandedRow(expandedRow === dept.id ? null : dept.id)}
                  >
                    <td className="p-4 font-black uppercase tracking-tight border-r-2 border-[#E0E0E0]">{dept.name}</td>
                    <td className="p-4 font-medium opacity-80 border-r-2 border-[#E0E0E0] whitespace-nowrap">{dept.authority}</td>
                    <td className="p-4 border-r-2 border-[#E0E0E0]">{getStatusBadge(dept.status)}</td>
                    <td className="p-4 text-center">
                      {expandedRow === dept.id ? <ChevronUp className="w-5 h-5 mx-auto" /> : <ChevronDown className="w-5 h-5 mx-auto opacity-50" />}
                    </td>
                  </tr>
                  
                  {expandedRow === dept.id && (
                    <tr className="bg-[#F9F9F9] border-b-2 border-[#121212]">
                      <td colSpan={4} className="p-0">
                        <div className="p-6 border-l-8 border-[#121212] m-4 bg-white shadow-[2px_2px_0px_0px_#121212]">
                          <p className="font-black uppercase text-xs tracking-widest mb-2 opacity-60">Latest Comment</p>
                          <p className="font-medium text-lg leading-relaxed mb-4">"{dept.note}"</p>
                          
                          {dept.status === 'Action Required' && (
                            <div className="pt-4 border-t-2 border-[#E0E0E0] flex items-center justify-between">
                              <p className="text-sm font-bold text-[#D02020] flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> This department requires action.
                              </p>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setRespondModal(dept); }} 
                                className="bg-[#121212] text-white px-4 py-2 font-bold uppercase text-xs tracking-widest hover:bg-[#D02020] transition-colors flex items-center gap-2"
                              >
                                Respond <Send className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212]">
         <div className="bg-[#F0C020] border-b-4 border-[#121212] p-5">
           <h2 className="font-black text-xl uppercase tracking-tight">Application Timeline</h2>
         </div>
         <div className="p-6 md:p-8 space-y-6">
            {[
              { date: 'Jun 12, 11:30 AM', event: 'HOD Approved Application', actor: 'Prof. Sharma' },
              { date: 'Jun 10, 04:15 PM', event: 'Laboratory Cleared', actor: 'Dr. Mehta' },
              { date: 'Jun 09, 09:20 AM', event: 'Hostel Due Added for Repair', actor: 'System' },
              { date: 'Jun 08, 10:00 AM', event: 'Clearance Application Submitted', actor: 'Hritani Joshi (You)' }
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="text-right w-24 md:w-32 shrink-0 pt-1">
                  <p className="font-bold text-xs uppercase tracking-widest opacity-60">{log.date.split(',')[0]}</p>
                  <p className="font-bold text-[10px] text-gray-500 uppercase">{log.date.split(',')[1]}</p>
                </div>
                <div className="w-2 rounded-full border-2 border-[#121212] bg-[#F0F0F0] mt-1.5 h-2 shrink-0 relative">
                  {i < 3 && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-[#E0E0E0] -z-10" />}
                </div>
                <div>
                  <p className="font-black uppercase tracking-tight text-[#121212]">{log.event}</p>
                  <p className="font-medium text-sm mt-0.5">{log.actor}</p>
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* Respond Modal */}
      {respondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setRespondModal(null)} />
          <div className="relative bg-white w-full max-w-lg border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] p-0 flex flex-col">
            <div className="bg-[#D02020] text-white p-4 border-b-4 border-[#121212] flex justify-between items-center">
              <h2 className="font-black text-lg uppercase tracking-tight">Respond to {respondModal.name}</h2>
              <button onClick={() => setRespondModal(null)}><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleRespondSubmit} className="p-6 flex flex-col gap-6">
              <div>
                <p className="font-black uppercase text-xs tracking-widest mb-2">Original Reason</p>
                <p className="font-medium p-3 bg-[#F0F0F0] border-2 border-[#E0E0E0]">{respondModal.note}</p>
              </div>

              <div>
                <label className="font-black uppercase text-xs tracking-widest mb-2 block">Your Message</label>
                <textarea 
                  className="w-full border-2 border-[#121212] p-3 font-medium outline-none focus:border-4 transition-all"
                  rows={4}
                  placeholder="Explain your action..."
                  required
                />
              </div>

              <div>
                <label className="font-black uppercase text-xs tracking-widest mb-2 block">Attach Proof (Optional)</label>
                <div className="w-full border-2 border-dashed border-[#121212] p-4 flex flex-col items-center justify-center bg-[#F9F9F9] hover:bg-[#F0F0F0] cursor-pointer transition-colors">
                   <Paperclip className="w-6 h-6 mb-2 opacity-50" />
                   <p className="font-bold text-sm uppercase opacity-70">Click to upload document</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setRespondModal(null)} className="flex-1 py-3 font-bold uppercase tracking-wider border-2 border-[#121212] hover:bg-[#F0F0F0]">Cancel</button>
                <button type="submit" className="flex-1 py-3 font-black uppercase tracking-wider bg-[#1040C0] text-white border-2 border-[#121212] hover:bg-blue-800">Submit Response</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
