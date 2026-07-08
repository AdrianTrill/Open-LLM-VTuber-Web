import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Stack, Text, Textarea, Button, Flex, Box, Input, Badge, Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { HiOutlineTrash, HiOutlineUpload, HiOutlineRefresh } from 'react-icons/hi';
interface DocInfo {
  name: string;
  size: number;
  modified: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Knowledge(): JSX.Element {
  const { t } = useTranslation();
  const apiBase = '';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [docs, setDocs] = useState<DocInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);

  const [pasteMode, setPasteMode] = useState(false);
  const [pasteName, setPasteName] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const showStatus = useCallback((msg: string, ok: boolean, duration = 5000) => {
    setStatus({ msg, ok });
    if (duration > 0) setTimeout(() => setStatus(null), duration);
  }, []);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/docs`);
      const data = await res.json();
      setDocs(data.docs || []);
    } catch {
      showStatus(t('knowledge.loadError'), false);
    } finally {
      setLoading(false);
    }
  }, [apiBase, showStatus, t]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const uploadFiles = useCallback(async (files: FileList) => {
    const results = await Promise.all(
      Array.from(files).map(async (file) => {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`${apiBase}/api/docs/upload`, { method: 'POST', body: form });
        return res.json();
      }),
    );
    const ok = results.filter((r) => r.status === 'ok').length;
    showStatus(t('knowledge.uploaded', { count: ok }), true);
    loadDocs();
  }, [apiBase, loadDocs, showStatus, t]);

  const handlePasteSubmit = useCallback(async () => {
    if (!pasteName.trim() || !pasteText.trim()) {
      showStatus(t('knowledge.pasteError'), false);
      return;
    }
    const form = new FormData();
    form.append('text', pasteText);
    form.append('filename', pasteName);
    try {
      const res = await fetch(`${apiBase}/api/docs/upload`, { method: 'POST', body: form });
      const data = await res.json();
      if (data.status === 'ok') {
        showStatus(t('knowledge.pasteSuccess', { name: data.name }), true);
        setPasteName('');
        setPasteText('');
        setPasteMode(false);
        loadDocs();
      }
    } catch {
      showStatus(t('knowledge.uploadError'), false);
    }
  }, [pasteName, pasteText, apiBase, loadDocs, showStatus, t]);

  const deleteDoc = useCallback(async (name: string) => {
    try {
      await fetch(`${apiBase}/api/docs/${encodeURIComponent(name)}`, { method: 'DELETE' });
      showStatus(t('knowledge.deleted', { name }), true);
      loadDocs();
    } catch {
      showStatus(t('knowledge.deleteError'), false);
    }
  }, [apiBase, loadDocs, showStatus, t]);

  const handleIngest = useCallback(async () => {
    setIngesting(true);
    showStatus(t('knowledge.indexing'), true, 0);
    try {
      const res = await fetch(`${apiBase}/api/docs/ingest`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        showStatus(t('knowledge.indexed', { count: data.count }), true);
      } else {
        showStatus(data.error || t('knowledge.indexError'), false);
      }
    } catch {
      showStatus(t('knowledge.indexError'), false);
    } finally {
      setIngesting(false);
    }
  }, [apiBase, showStatus, t]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  }, [uploadFiles]);

  return (
    <Stack gap={4} p={4}>
      {/* Upload area */}
      <Box
        border="2px dashed"
        borderColor={dragOver ? 'purple.400' : 'whiteAlpha.300'}
        borderRadius="lg"
        p={6}
        textAlign="center"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ borderColor: 'purple.400', bg: 'whiteAlpha.50' }}
        bg={dragOver ? 'whiteAlpha.50' : 'transparent'}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Icon as={HiOutlineUpload} boxSize={6} color="whiteAlpha.600" mb={2} />
        <Text fontSize="sm" color="whiteAlpha.700">{t('knowledge.dropHere')}</Text>
        <Text fontSize="xs" color="whiteAlpha.500" mt={1}>{t('knowledge.dropFormats')}</Text>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.md,.json,.csv"
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ''; }}
        />
      </Box>

      {/* Paste text toggle */}
      <Button
        size="xs"
        variant="outline"
        colorPalette="gray"
        alignSelf="flex-start"
        onClick={() => setPasteMode(!pasteMode)}
      >
        {pasteMode ? t('knowledge.hideTextInput') : t('knowledge.pasteText')}
      </Button>

      {pasteMode && (
        <Box bg="gray.800" borderRadius="md" p={3}>
          <Input
            size="sm"
            bg="gray.900"
            borderColor="whiteAlpha.200"
            color="white"
            mb={2}
            placeholder={t('knowledge.docNamePlaceholder')}
            value={pasteName}
            onChange={(e) => setPasteName(e.target.value)}
          />
          <Textarea
            size="sm"
            bg="gray.900"
            borderColor="whiteAlpha.200"
            color="white"
            fontFamily="mono"
            fontSize="xs"
            minH="100px"
            resize="vertical"
            placeholder={t('knowledge.pasteContentPlaceholder')}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <Flex justify="flex-end" mt={2}>
            <Button size="xs" colorPalette="blue" onClick={handlePasteSubmit}>
              {t('knowledge.addDocument')}
            </Button>
          </Flex>
        </Box>
      )}

      {/* Document list */}
      <Box>
        <Flex align="center" justify="space-between" mb={2}>
          <Flex align="center" gap={2}>
            <Text fontSize="xs" fontWeight="600" textTransform="uppercase" color="whiteAlpha.600">
              {t('knowledge.documents')}
            </Text>
            <Badge size="sm" colorPalette="gray">{docs.length}</Badge>
          </Flex>
          <Button
            size="xs"
            variant="ghost"
            colorPalette="gray"
            onClick={loadDocs}
            loading={loading}
          >
            <Icon as={HiOutlineRefresh} />
          </Button>
        </Flex>

        {docs.length === 0 ? (
          <Text fontSize="sm" color="whiteAlpha.400" textAlign="center" py={4}>
            {t('knowledge.noDocs')}
          </Text>
        ) : (
          <Stack gap={1} maxH="200px" overflowY="auto" css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { bg: 'whiteAlpha.300', borderRadius: 'full' },
          }}>
            {docs.map((doc) => (
              <Flex
                key={doc.name}
                align="center"
                justify="space-between"
                py={1.5}
                px={2}
                borderRadius="md"
                _hover={{ bg: 'whiteAlpha.50' }}
              >
                <Box>
                  <Text fontSize="sm" color="white" fontWeight="500">{doc.name}</Text>
                  <Text fontSize="xs" color="whiteAlpha.500">{formatSize(doc.size)}</Text>
                </Box>
                <Button
                  size="xs"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => deleteDoc(doc.name)}
                >
                  <Icon as={HiOutlineTrash} />
                </Button>
              </Flex>
            ))}
          </Stack>
        )}
      </Box>

      {/* Re-index button */}
      <Box borderTop="1px solid" borderColor="whiteAlpha.200" pt={3}>
        <Flex align="center" justify="space-between">
          <Text fontSize="xs" color="whiteAlpha.500">{t('knowledge.reindexHint')}</Text>
          <Button
            size="sm"
            colorPalette="green"
            loading={ingesting}
            onClick={handleIngest}
          >
            {t('knowledge.reindex')}
          </Button>
        </Flex>
      </Box>

      {status && (
        <Box
          p={2}
          borderRadius="md"
          bg={status.ok ? 'green.900' : 'red.900'}
          color={status.ok ? 'green.200' : 'red.200'}
          fontSize="sm"
        >
          {status.msg}
        </Box>
      )}
    </Stack>
  );
}

export default Knowledge;
