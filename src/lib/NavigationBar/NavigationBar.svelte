<script>
    import { assets } from '$app/paths';
</script>

<div class="nav">
    <img
        src={`${assets}/icon.svg`}
        alt="Logo"
        class="logo-margin"
        style="height: 40px;"
    />
    <slot />
</div>

<style>
    .nav {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 3.5rem;

        display: flex;
        flex-direction: row;
        align-items: center;
        z-index: 100;

        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .logo-margin {
        margin: 0 12px;
        margin-left: 16px;
        transition: transform 0.3s ease;
    }

    .logo-margin:hover {
        transform: scale(1.05);
    }

    :global(.dark) .nav {
        background: linear-gradient(135deg, #2E7D32, #1B5E20);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
</style>