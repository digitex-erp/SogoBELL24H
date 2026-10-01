import { useState, useEffect, useCallback, useRef } from 'react'
import { Video, Play, Pause, Square, SkipForward, SkipBack, Volume2, VolumeX, Maximize, Download, Trash2, Heart, Search, Filter, Clock, Zap, AlertTriangle, CheckCircle, XCircle, Loader2, RefreshCw, BarChart3, Settings, ChevronDown, Eye, Copy, Tag, Film, Monitor, Smartphone, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/cn'

const API = '/api/video-factory'

async function api(path: string, opts: { method?: string; body?: any; token?: string } = {}) {
  const url = `${API}${path}${opts.token ? `?token=${opts.token}` : ''}`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const r = await fetch(url, { method: opts.method || 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined })
  return r.json()
}

function VideoPlayer({ src, thumbnail, title, duration, onDownload, onClose }: {
  src: string; thumbnail?: string; title: string; duration?: number; onDownload?: () => void; onClose?: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(duration || 0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) videoRef.current.pause(); else videoRef.current.play()
    setPlaying(!playing)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const time = parseFloat(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!fullscreen) containerRef.current.requestFullscreen?.(); else document.exitFullscreen?.()
    setFullscreen(!fullscreen)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60); const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div ref={containerRef} className={cn("bg-black rounded-xl overflow-hidden", fullscreen ? "fixed inset-0 z-50" : "relative")}>
      <video ref={videoRef} src={src} poster={thumbnail} className="w-full max-h-[70vh] object-contain" onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => { if (videoRef.current) setTotalTime(videoRef.current.duration) }}
        onEnded={() => setPlaying(false)} onClick={togglePlay} />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-2 mb-2">
          <input type="range" min={0} max={totalTime || 0} value={currentTime} onChange={handleSeek} className="flex-1 h-1 accent-emerald-500" />
        </div>
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="hover:text-emerald-400 transition">{playing ? <Pause size={20} /> : <Play size={20} />}</button>
            <button onClick={toggleMute} className="hover:text-emerald-400 transition">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
            <span className="text-xs">{formatTime(currentTime)} / {formatTime(totalTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            {onDownload && <button onClick={onDownload} className="hover:text-emerald-400 transition"><Download size={18} /></button>}
            <button onClick={toggleFullscreen} className="hover:text-emerald-400 transition"><Maximize size={18} /></button>
            {onClose && <button onClick={onClose} className="hover:text-emerald-400 transition"><XCircle size={18} /></button>}
          </div>
        </div>
      </div>
      <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-white text-xs font-medium truncate max-w-[60%]">{title}</div>
    </div>
  )
}

export function VideoFactoryPage() {
  const [tab, setTab] = useState('generate')
  const [token, setToken] = useState('')
  const [providers, setProviders] = useState<any[]>([])
  const [config, setConfig] = useState<any>({})
  const [assets, setAssets] = useState<any[]>([])
  const [queueJobs, setQueueJobs] = useState<any[]>([])
  const [costs, setCosts] = useState<any>({})
  const [health, setHealth] = useState<any>({})
  const [testResults, setTestResults] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showPlayer, setShowPlayer] = useState(false)

  const [form, setForm] = useState({
    provider: 'pollinations', prompt: '', negativePrompt: '', duration: 4,
    width: 1280, height: 720, fps: 24, aspectRatio: '16:9', seed: '',
  })

  useEffect(() => {
    const t = localStorage.getItem('bell24h_token') || ''
    setToken(t)
  }, [])

  const load = useCallback(async () => {
    if (!token) return
    const [p, c, a, q, co, h] = await Promise.all([
      api('/providers', { token }),
      api('/config', { token }),
      api('/assets', { token }),
      api('/queue', { token }),
      api('/costs', { token }),
      api('/health', { token }),
    ])
    setProviders(p.providers || [])
    setConfig(c)
    setAssets(a.assets || [])
    setQueueJobs(q.jobs || [])
    setCosts(co)
    setHealth(h)
  }, [token])

  useEffect(() => { load() }, [load])

  const handleGenerate = async () => {
    if (!form.prompt || !token) return
    setGenerating(true)
    try {
      const r = await api('/generate', { method: 'POST', token, body: {
        provider: form.provider, prompt: form.prompt, negativePrompt: form.negativePrompt || undefined,
        duration: form.duration, width: form.width, height: form.height, fps: form.fps,
        aspectRatio: form.aspectRatio, seed: form.seed ? parseInt(form.seed) : undefined,
      }})
      if (r.video) {
        setSelectedVideo(r.video)
        setShowPlayer(true)
        setForm(f => ({ ...f, prompt: '' }))
        load()
      }
    } finally { setGenerating(false) }
  }

  const handleQueueJob = async () => {
    if (!form.prompt || !token) return
    await api('/queue', { method: 'POST', token, body: {
      prompt: form.prompt, provider: form.provider, duration: form.duration,
      width: form.width, height: form.height, fps: form.fps, aspectRatio: form.aspectRatio,
    }})
    setForm(f => ({ ...f, prompt: '' }))
    load()
  }

  const handleProcessQueue = async () => {
    if (!token) return
    await api('/queue/process', { method: 'POST', token })
    load()
  }

  const handleRunTests = async () => {
    if (!token) return
    const r = await api('/tests', { token })
    setTestResults(r)
  }

  const handleToggleFavorite = async (id: string) => {
    await api(`/assets/${id}/favorite`, { method: 'POST', token })
    load()
  }

  const handleDelete = async (id: string) => {
    await api(`/assets/${id}`, { method: 'DELETE', token })
    load()
  }

  const handleSoftDelete = async (id: string) => {
    await api(`/assets/${id}/soft-delete`, { method: 'POST', token })
    load()
  }

  const providersList = Array.isArray(providers) ? providers : []
  const aspectRatios = config.aspectRatios || []
  const durations = config.durations || [2, 3, 4, 5, 6, 8, 10, 15]
  const fpsOptions = config.fps || [24, 25, 30, 60]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Film className="text-purple-500" /> Video Factory</h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise video generation, preview, and asset management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{providersList.length} providers</Badge>
          <Badge variant="outline" className="text-xs">{health.assets || 0} videos</Badge>
          <Badge variant={health.totalCost > 0 ? 'default' : 'secondary'} className="text-xs">${(health.totalCost || 0).toFixed(4)}</Badge>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="generate"><Play className="w-3 h-3 mr-1" />Generate</TabsTrigger>
          <TabsTrigger value="library"><Film className="w-3 h-3 mr-1" />Library</TabsTrigger>
          <TabsTrigger value="queue"><Clock className="w-3 h-3 mr-1" />Queue</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="w-3 h-3 mr-1" />Costs</TabsTrigger>
          <TabsTrigger value="providers"><Zap className="w-3 h-3 mr-1" />Providers</TabsTrigger>
          <TabsTrigger value="tests"><CheckCircle className="w-3 h-3 mr-1" />Tests</TabsTrigger>
        </TabsList>

        {/* ═══ GENERATE TAB ═══ */}
        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Video Generation</CardTitle><CardDescription>Configure and generate video through the AI Router</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select value={form.provider} onValueChange={v => setForm(f => ({ ...f, provider: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {providersList.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>{p.name} {p.free ? '(Free)' : `($${p.costPerSecond}/s)`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prompt</Label>
                  <Textarea value={form.prompt} onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
                    placeholder="Describe the video you want to generate..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Negative Prompt (optional)</Label>
                  <Input value={form.negativePrompt} onChange={e => setForm(f => ({ ...f, negativePrompt: e.target.value }))}
                    placeholder="What to avoid in the video..." />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1"><Label>Duration (s)</Label>
                    <Select value={String(form.duration)} onValueChange={v => setForm(f => ({ ...f, duration: parseInt(v) }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{durations.map((d: number) => <SelectItem key={d} value={String(d)}>{d}s</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div className="space-y-1"><Label>Aspect Ratio</Label>
                    <Select value={form.aspectRatio} onValueChange={v => {
                      const r = aspectRatios.find((r: any) => r.id === v)
                      setForm(f => ({ ...f, aspectRatio: v, width: r?.w || 1280, height: r?.h || 720 }))
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{aspectRatios.map((r: any) => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div className="space-y-1"><Label>FPS</Label>
                    <Select value={String(form.fps)} onValueChange={v => setForm(f => ({ ...f, fps: parseInt(v) }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{fpsOptions.map((f: number) => <SelectItem key={f} value={String(f)}>{f}</SelectItem>)}</SelectContent>
                    </Select></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1"><Label>Width</Label><Input type="number" value={form.width} onChange={e => setForm(f => ({ ...f, width: parseInt(e.target.value) || 1280 }))} /></div>
                  <div className="space-y-1"><Label>Height</Label><Input type="number" value={form.height} onChange={e => setForm(f => ({ ...f, height: parseInt(e.target.value) || 720 }))} /></div>
                  <div className="space-y-1"><Label>Seed</Label><Input type="number" value={form.seed} onChange={e => setForm(f => ({ ...f, seed: e.target.value }))} placeholder="Random" /></div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleGenerate} disabled={!form.prompt || generating} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Play className="w-4 h-4 mr-2" />Generate Video</>}
                  </Button>
                  <Button onClick={handleQueueJob} disabled={!form.prompt} variant="outline">
                    <Clock className="w-4 h-4 mr-2" />Queue
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Preview</CardTitle></CardHeader>
              <CardContent>
                {selectedVideo ? (
                  <div className="space-y-3">
                    {selectedVideo.url ? (
                      <VideoPlayer src={selectedVideo.url} thumbnail={selectedVideo.thumbnailUrl} title={selectedVideo.title || selectedVideo.prompt}
                        duration={selectedVideo.duration} onDownload={() => window.open(selectedVideo.url)} onClose={() => setSelectedVideo(null)} />
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        <div className="text-center"><Film className="w-12 h-12 mx-auto mb-2" /><p>No preview available</p></div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-500">Provider</span><p className="font-medium">{selectedVideo.provider}</p></div>
                      <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-500">Duration</span><p className="font-medium">{selectedVideo.duration}s</p></div>
                      <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-500">Resolution</span><p className="font-medium">{selectedVideo.width}x{selectedVideo.height}</p></div>
                      <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-500">Cost</span><p className="font-medium">${(selectedVideo.costUsd || 0).toFixed(4)}</p></div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                    <div className="text-center"><Film className="w-12 h-12 mx-auto mb-2" /><p>Generate a video to see preview</p></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ═══ LIBRARY TAB ═══ */}
        <TabsContent value="library" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search videos..." className="pl-9" />
            </div>
            <Badge variant="outline">{assets.length} videos</Badge>
          </div>
          {assets.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-gray-400"><Film className="w-12 h-12 mx-auto mb-3" /><p>No videos yet. Generate your first video!</p></CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {assets.map(v => (
                <Card key={v.id} className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setSelectedVideo(v); setShowPlayer(true) }}>
                  <div className="relative aspect-video bg-gray-100">
                    {v.thumbnailUrl ? (
                      <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Film className="w-8 h-8 text-gray-300" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition"><Play className="w-10 h-10 text-white drop-shadow-lg" /></div>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">{v.duration}s</div>
                    <div className="absolute top-1 right-1">
                      <button onClick={e => { e.stopPropagation(); handleToggleFavorite(v.id) }}
                        className="p-1 rounded-full bg-black/50 hover:bg-black/70 transition">
                        <Heart className={cn("w-3 h-3", v.isFavorite ? "fill-red-500 text-red-500" : "text-white")} />
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{v.title || v.prompt}</p>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                      <span>{v.provider} · {v.width}x{v.height}</span>
                      <span>{v.fps}fps</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant={v.status === 'completed' ? 'default' : v.status === 'failed' ? 'destructive' : 'secondary'} className="text-[10px]">{v.status}</Badge>
                      <span className="text-xs text-gray-400">${(v.costUsd || 0).toFixed(4)}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="outline" className="h-6 text-xs flex-1" onClick={e => { e.stopPropagation(); setSelectedVideo(v); setShowPlayer(true) }}>
                        <Play className="w-3 h-3 mr-1" />Play
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs" onClick={e => { e.stopPropagation(); handleSoftDelete(v.id) }}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ═══ QUEUE TAB ═══ */}
        <TabsContent value="queue" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Video Queue</h2>
            <Button onClick={handleProcessQueue} size="sm"><Zap className="w-4 h-4 mr-1" />Process Queue</Button>
          </div>
          {queueJobs.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-gray-400"><Clock className="w-12 h-12 mx-auto mb-3" /><p>No jobs in queue</p></CardContent></Card>
          ) : (
            <div className="space-y-2">
              {queueJobs.map(job => (
                <Card key={job.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {job.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                       job.status === 'failed' ? <XCircle className="w-5 h-5 text-red-500" /> :
                       job.status === 'processing' ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> :
                       <Clock className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{job.prompt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{job.provider}</span><span>{job.duration}s</span><span>{job.width}x{job.height}</span>
                        {job.costUsd > 0 && <span>${job.costUsd.toFixed(4)}</span>}
                      </div>
                    </div>
                    <Badge variant={job.status === 'completed' ? 'default' : job.status === 'failed' ? 'destructive' : 'secondary'}>{job.status}</Badge>
                    {job.progress > 0 && job.progress < 100 && <Progress value={job.progress} className="w-20" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ═══ COSTS TAB ═══ */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">${(costs.totalCost || 0).toFixed(4)}</p>
              <p className="text-xs text-gray-500">Total Cost</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{costs.totalVideos || 0}</p>
              <p className="text-xs text-gray-500">Videos Generated</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{health.memory || 0}MB</p>
              <p className="text-xs text-gray-500">Memory Usage</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{health.assets || 0}</p>
              <p className="text-xs text-gray-500">Total Assets</p>
            </CardContent></Card>
          </div>
          {(costs.byProvider || []).length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Cost by Provider</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {costs.byProvider.map((p: any) => (
                    <div key={p.provider} className="flex items-center gap-3">
                      <span className="text-sm w-24">{p.provider}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${Math.min((p.cost / (costs.totalCost || 1)) * 100, 100)}%` }} />
                      </div>
                      <span className="text-sm w-20 text-right">${p.cost.toFixed(4)}</span>
                      <span className="text-xs text-gray-400 w-16 text-right">{p.count} videos</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ═══ PROVIDERS TAB ═══ */}
        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providersList.map((p: any) => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{p.name}</h3>
                    {p.free ? <Badge className="bg-green-100 text-green-700">Free</Badge> : <Badge variant="outline">${p.costPerSecond}/s</Badge>}
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Models: {p.models?.join(', ')}</p>
                    <p>Health: <Badge variant={p.health === 'healthy' ? 'default' : 'secondary'} className="text-xs">{p.health}</Badge></p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══ TESTS TAB ═══ */}
        <TabsContent value="tests" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Integration Tests</h2>
            <Button onClick={handleRunTests} size="sm"><Zap className="w-4 h-4 mr-1" />Run Tests</Button>
          </div>
          {testResults && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={testResults.summary.score === 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {testResults.summary.score}%
                  </Badge>
                  <span className="text-sm">{testResults.summary.passed}/{testResults.summary.total} passed</span>
                  <span className="text-xs text-gray-400">{testResults.summary.duration}ms</span>
                </div>
                <div className="space-y-2">
                  {testResults.results.map((t: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      {t.passed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      <span className="flex-1">{t.name}</span>
                      <span className="text-xs text-gray-400">{t.duration}ms</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Player Dialog */}
      <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          {selectedVideo?.url && (
            <VideoPlayer src={selectedVideo.url} thumbnail={selectedVideo.thumbnailUrl} title={selectedVideo.title || selectedVideo.prompt}
              duration={selectedVideo.duration} onDownload={() => window.open(selectedVideo.url)} onClose={() => setShowPlayer(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
