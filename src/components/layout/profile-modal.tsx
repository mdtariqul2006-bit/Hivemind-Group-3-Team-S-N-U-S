import { useEffect, useRef, useState } from 'react';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useMember, initialsFor } from '@/state/member-context';
import { fileToAvatarDataUrl } from '@/lib/avatar-image';
import { useToast } from '@/state/toast-context';

const TITLE_ID = 'profile-modal-title';

/**
 * Profile editing: display name and avatar photo.
 *
 * The picked image is shrunk and previewed locally, and only written when the
 * form is submitted, so backing out of the dialog leaves the stored profile
 * untouched. Saving reports the real outcome, including a storage failure,
 * rather than assuming it worked.
 */
export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, updateProfile } = useMember();
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the draft each time the dialog opens, so a cancelled edit does not
  // reappear the next time it is opened.
  useEffect(() => {
    if (!open || !user) return;
    setName(user.name ?? '');
    setAvatarUrl(user.avatarUrl);
    setError(null);
    setBusy(false);
  }, [open, user]);

  if (!user) return null;

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Clear immediately so picking the same file twice still fires a change.
    e.target.value = '';
    if (!file) return;

    setBusy(true);
    setError(null);
    const result = await fileToAvatarDataUrl(file);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setAvatarUrl(result.dataUrl);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = updateProfile({ name, avatarUrl });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    push('Profile updated', 'sage');
    onClose();
  }

  const previewUser = { ...user, name: name.trim() || undefined };

  return (
    <Modal open={open} onClose={onClose} labelledBy={TITLE_ID}>
      <form onSubmit={onSubmit} className="p-6 sm:p-7">
        <h2 id={TITLE_ID} className="text-xl font-bold text-ink">
          Your profile
        </h2>
        <p className="mt-1 text-sm text-muted">
          This is what your team sees next to your name.
        </p>

        <div className="mt-6 flex items-center gap-4">
          <Avatar
            initials={initialsFor(previewUser)}
            src={avatarUrl}
            accent="honey"
            size={72}
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                iconLeft={
                  busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />
                }
              >
                {busy ? 'Processing' : avatarUrl ? 'Change photo' : 'Upload photo'}
              </Button>
              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAvatarUrl(undefined)}
                  disabled={busy}
                  iconLeft={<Trash2 className="h-4 w-4" />}
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted">
              JPG, PNG, or WebP. Cropped to a square and shrunk automatically.
            </p>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="sr-only"
          aria-label="Choose a profile photo"
        />

        <label className="mt-6 block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Display name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={user.email.split('@')[0]}
            maxLength={60}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-honey"
          />
        </label>

        <p className="mt-3 text-xs text-muted">
          Signed in as <span className="font-medium text-ink">{user.email}</span>
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-pink-wash px-3.5 py-2.5 text-sm text-ink">
            {error}
          </p>
        )}

        <div className="mt-7 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
